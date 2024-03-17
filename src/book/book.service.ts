
import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './schemas/book.schema';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// import { Query } from 'mongoose';
import { Query } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';
@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ){}

    async findAll(query: Query):Promise<Book[]>{
        // console.log(query);
        const resPerPage = 2
        const currentPage = Number(query.page) || 1
        const skip = resPerPage*(currentPage-1)

        const keyword = query.keyword? {
            title:{
                $regex: query.keyword,
                $options: 'i'
            },
        }:{};
        const books = await this.bookModel
        .find({ ...keyword})
        .limit(resPerPage)
        .skip(skip)
        return books;
    }


    //create function
    async create(book: Book, user: User): Promise<Book>{
        const data = Object.assign(book, {user: user._id})
        const res = await this.bookModel.create(data);
        return res;
    }
    
    //findById
    async findById(id: string): Promise<Book>{
        const isValidId = mongoose.isValidObjectId(id)
        if(!isValidId){
            throw new NotFoundException('Please Enter correct id');
        }
        const book = await this.bookModel.findById(id);
        if(!book){
            throw new NotFoundException('Book is not found');
        }
        return book;
    }

    //updatebyId
    async updateById(id: string, book: Book): Promise<Book>{
        return await this.bookModel.findByIdAndUpdate(id, book,{
            new: true,
            runValidators: true,
        })
    }

    //deleteById
    async deleteById(id: string): Promise<Book>{
        return await this.bookModel.findByIdAndDelete(id);
    }

}
