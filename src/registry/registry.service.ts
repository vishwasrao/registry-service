import { Injectable } from '@nestjs/common';
import { CreateRegistryDto } from './dto/create-registry.dto';
import { UpdateRegistryDto } from './dto/update-registry.dto';
import * as fs from 'fs';
import * as path from 'path';

export interface RegistryData {
  iss: string;
  jku: string;
  clientId: string;
  clientName: string;
  services?: ServiceDesc[];
}

export interface ServiceDesc {
  id: string;
  name: string;
  description?: string;
  hook?: string;
}

@Injectable()
export class RegistryService {
  private dbPath = path.join(process.cwd(), 'src', 'registry', 'db.json');

  private readDb(): RegistryData[] {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf-8');
      return JSON.parse(data) as RegistryData[];
    } catch (err) {
      // keep the caught error available for future logging without causing unused-var lint failures
      void err;
      return [];
    }
  }

  create(_createRegistryDto: CreateRegistryDto) {
    // reference the param to avoid no-unused-vars until implemented
    void _createRegistryDto;
    return 'This action adds a new registry';
  }

  findAll(iss?: string, jku?: string): RegistryData[] {
    // print query parameters for debugging
    console.log(`Query Parameters - iss: ${iss}, jku: ${jku}`);
    // print the resolved dbPath for debugging
    console.log('Resolved dbPath:', this.dbPath);
    const db = this.readDb();
    if (iss && jku) {
      const result = db.find((item) => item.iss === iss && item.jku === jku);
      return result ? [result] : [];
    }
    return db;
  }

  /**
   * Find a single registry entry by iss and jku. Returns null if not found.
   */
  findByIssJku(iss: string, jku: string): RegistryData | null {
    const db = this.readDb();
    const result = db.find((item) => item.iss === iss && item.jku === jku);
    return result ?? null;
  }

  /**
   * Aggregate and return all services defined in the registry database.
   */
  findServices(): { services: ServiceDesc[] } {
    const db = this.readDb();
    const services: ServiceDesc[] = [];
    for (const entry of db) {
      if (Array.isArray(entry.services)) {
        services.push(...entry.services);
      }
    }
    return { services };
  }

  findOne(id: number) {
    return `This action returns a #${id} registry`;
  }

  update(id: number, _updateRegistryDto: UpdateRegistryDto) {
    // reference the param to avoid no-unused-vars until implemented
    void _updateRegistryDto;
    return `This action updates a #${id} registry`;
  }

  remove(id: number) {
    return `This action removes a #${id} registry`;
  }
}
