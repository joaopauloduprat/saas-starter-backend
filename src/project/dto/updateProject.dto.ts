import { PartialType } from '@nestjs/swagger';

import { CreateProjectDto } from './createProject.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
