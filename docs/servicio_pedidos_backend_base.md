# Implementación Base de servicio-pedidos (Backend)

Este documento detalla la estructura básica y el código NestJS recomendado para implementar los endpoints del **`servicio-pedidos`** y el manejo correcto de sus respuestas y excepciones.

## 1. Estructura de Datos y DTOs (`contracts`)
Definición de los contratos de entrada con sus respectivas validaciones utilizando `class-validator` y `class-transformer`.

```typescript
import { IsString, IsNotEmpty, IsArray, ValidateNested, ArrayMinSize, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PedidoItemInput {
  @IsString()
  @IsNotEmpty()
  productoId: string;

  @Type(() => Number)
  cantidad: number;

  @Type(() => Number)
  precio: number;
}

export class CrearPedidoCommand {
  @IsString()
  @IsNotEmpty()
  mesaId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PedidoItemInput)
  items: PedidoItemInput[];

  @IsOptional()
  @IsString()
  cliente?: string;

  @IsOptional()
  @IsString()
  modalidad?: string;
}
```

## 2. Controlador (`app.controller.ts`)
El controlador mapea los endpoints REST HTTP y delega la ejecución de la lógica al servicio.

```typescript
import { Controller, Get, Post, Body, Param, Patch, Query, HttpStatus, HttpCode, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { CrearPedidoCommand } from './dto/crear-pedido.dto';

@Controller('api/pedidos')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 1. Respuesta Exitosa / Registro (201 Created)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crearPedido(@Body() body: CrearPedidoCommand) {
    return await this.appService.crearPedido(body);
  }

  @Get()
  async listarPedidos() {
    return await this.appService.listarPedidos();
  }

  // 2. Respuesta Detalle (200 / 404 Not Found)
  @Get(':id')
  async obtenerDetalle(@Param('id') id: string) {
    return await this.appService.obtenerDetalle(id);
  }
}
```

## 3. Servicio de Negocio (`app.service.ts`)
Aquí se procesan las reglas de negocio y se lanzan las excepciones adecuadas que NestJS convertirá automáticamente en códigos HTTP.

```typescript
import { Injectable, NotFoundException, UnprocessableEntityException, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { CrearPedidoCommand } from './dto/crear-pedido.dto';

@Injectable()
export class AppService {
  private pedidos = []; // Base de datos simulada en memoria

  async crearPedido(command: CrearPedidoCommand) {
    // A. Simulación de Error de Negocio (422 Unprocessable Entity)
    // Regla: No se pueden registrar pedidos para mesas ocupadas o inactivas
    if (command.mesaId === 'mesa-ocupada' || command.mesaId === 'mesa-inactiva') {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: 'MESA_NO_DISPONIBLE',
        message: `La mesa '${command.mesaId}' no está disponible para recibir nuevos pedidos.`
      });
    }

    // B. Simulación de Error Técnico (500 Internal Server Error)
    if (command.mesaId === 'error-tecnico') {
      throw new InternalServerErrorException('Fallo crítico no controlado en la conexión a Prisma DB.');
    }

    // C. Simulación de Timeout
    if (command.mesaId === 'timeout') {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Espera 10 segundos
    }

    // Flujo feliz (Exito - 201)
    const nuevoPedido = {
      id: `pedido-${Math.floor(100 + Math.random() * 900)}`,
      mesaId: command.mesaId,
      cliente: command.cliente || 'Consumidor Final',
      items: command.items,
      estado: 'CREADO',
      fechaCreacion: new Date()
    };
    this.pedidos.push(nuevoPedido);
    return nuevoPedido;
  }

  async listarPedidos() {
    return this.pedidos;
  }

  async obtenerDetalle(id: string) {
    if (id === 'nonexistent') {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: 'El pedido solicitado no existe.'
      });
    }

    const pedido = this.pedidos.find(p => p.id === id);
    if (!pedido) {
      throw new NotFoundException(`El pedido con ID ${id} no fue encontrado.`);
    }

    return pedido;
  }
}
```

## 4. Gestión de Códigos de Respuesta a Nivel Backend

| Escenario | Excepción NestJS a lanzar | Código HTTP resultante | Comportamiento del Servidor |
| :--- | :--- | :--- | :--- |
| **Contrato Inconsistente** | Ninguna (Manejado por NestJS `ValidationPipe` en el entry point) | `400 Bad Request` | Intercepta automáticamente campos inválidos o faltantes antes de entrar al controller. |
| **Error de Negocio** | `UnprocessableEntityException` o `ConflictException` | `422` o `409` | El backend valida una regla de negocio rota y devuelve un código específico para que el cliente actúe. |
| **Error Técnico** | `InternalServerErrorException` o Excepciones no controladas de Node.js / Prisma | `500 Internal Server Error` | El runtime captura el error inesperado, hace logging y oculta el stacktrace detallado al exterior. |
| **Recurso Inexistente** | `NotFoundException` | `404 Not Found` | Lanzado cuando no existe correspondencia para el ID solicitado en BD. |
| **Timeout** | Configuración a nivel Gateway (ej. Kong, Nginx o HttpTimeoutInterceptor) | `504 Gateway Timeout` | Si un microservicio descendente excede el tiempo límite, se corta la petición automáticamente. |
