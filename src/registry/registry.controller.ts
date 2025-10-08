import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RegistryService, RegistryData } from './registry.service';
import { BadRequestException } from '@nestjs/common';
import { CreateRegistryDto } from './dto/create-registry.dto';
import { UpdateRegistryDto } from './dto/update-registry.dto';

@Controller('registry')
export class RegistryController {
  constructor(private readonly registryService: RegistryService) { }

  @Post()
  create(@Body() createRegistryDto: CreateRegistryDto) {
    return this.registryService.create(createRegistryDto);
  }

  @Get()
  findAll(
    @Query('iss') iss?: string,
    @Query('jku') jku?: string,
  ):
    | RegistryData[]
    | { clientId: string; clientName: string }
    | { clientId?: undefined; clientName?: undefined } {
    return this.registryService.findAll(iss, jku);
  }

  @Get('discovery')
  discoveryGet(@Query('iss') iss?: string, @Query('jku') jku?: string) {
    // Validate presence
    if (!iss || !jku) {
      throw new BadRequestException('iss and jku query parameters are required');
    }
    // Validate URL formats
    try {
      // eslint-disable-next-line no-new
      new URL(iss);
      // eslint-disable-next-line no-new
      new URL(jku);
    } catch (e) {
      throw new BadRequestException('iss and jku must be valid URLs');
    }

    return this.registryService.findServices(iss, jku);
  }

  // POST discovery removed; use GET /registry/discovery?iss=...&jku=...

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRegistryDto: UpdateRegistryDto,
  ) {
    return this.registryService.update(+id, updateRegistryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registryService.remove(+id);
  }
}
