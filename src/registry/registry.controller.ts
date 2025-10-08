import {
  NotFoundException,
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
  ): RegistryData | RegistryData[] {
    if (iss && jku) {
      const entry = this.registryService.findByIssJku(iss, jku);
      if (!entry) {
        throw new NotFoundException('Registry entry not found');
      }
      return entry;
    }
    return this.registryService.findAll();
  }

  @Get('discovery')
  discoveryGet() {
    return this.registryService.findServices();
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
