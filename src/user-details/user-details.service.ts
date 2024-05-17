import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { UserDetail } from './user-detail.model';

@Injectable()
export class UserDetailsService {
  private userDetails: UserDetail[] = [];

  findAll(): UserDetail[] {
    return this.userDetails;
  }

  findOne(id: string): UserDetail {
    return this.userDetails.find((detail) => detail.id === id);
  }

  create(createUserDetailDto: CreateUserDetailDto): UserDetail {
    const newUserDetail: UserDetail = {
      id: uuidv4(),
      ...createUserDetailDto,
    };
    this.userDetails.push(newUserDetail);
    return newUserDetail;
  }

  update(id: string, updateUserDetailDto: UpdateUserDetailDto): UserDetail {
    const detailIndex = this.userDetails.findIndex(
      (detail) => detail.id === id,
    );
    if (detailIndex === -1) {
      return null;
    }
    this.userDetails[detailIndex] = {
      ...this.userDetails[detailIndex],
      ...updateUserDetailDto,
    };
    return this.userDetails[detailIndex];
  }

  delete(id: string): void {
    this.userDetails = this.userDetails.filter((detail) => detail.id !== id);
  }
}
