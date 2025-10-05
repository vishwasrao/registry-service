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
import { CreateRegistryDto } from './dto/create-registry.dto';
import { UpdateRegistryDto } from './dto/update-registry.dto';

@Controller('registry')
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {}

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
