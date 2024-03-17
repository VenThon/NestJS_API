import { Test, TestingModule } from "@nestjs/testing"
import { BookService } from "./book.service"
import { getModelToken } from "@nestjs/mongoose"
import { Book, Category } from "./schemas/book.schema"
import mongoose, { Model, model } from "mongoose"
import { BadRequestException, NotFoundException } from "@nestjs/common"
// import { ExpressAdapter } from "@nestjs/platform-express"

describe('BookService', ()=>{
    
    let bookService: BookService;
    let model: Model<Book>;
    const mockBook = {
        _id: '65d2cb08cda122008acb97f9',
        user: '65cede05ef5a2ae3833d0864',
        title: 'Book sex',
        description: 'The best happy',
        author:  'author',
        price: 460,
        category:Category.ADVENTURE
    };

    const mockBookService = {
        findById: jest.fn{}
    };
    
    beforeEach(async() =>{
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookService,
                {
                    provide: getModelToken(Book.name),
                    useValue: mockBookService,
                },
            ],
        }).compile();

        bookService = module.get<BookService>(BookService);
        model = module.get<Model<Book>>(getModelToken(Book.name));
    });

    describe('findById', () =>{
        it('should find  and return a book by ID', async () =>{
            jest.spyOn(model, 'findById').mockResolvedValue(mockBook);
            const result = await BookService.findById(mockBook._id);
            expect(model.findById).toHaveBeenLastCalledWith(mockBook._id)
            expect(result).toEqual(mockBook);

        });

        it('should throw BadRequestException if invalid ID is provided', async() =>{
            const id= 'invalid-id'
            const isValidObjectIdMock = jest
            .spyOn(mongoose, 'isValidObjectId')
            .mockReturnValue(false)

            await expect(bookService.findById(id)).rejects.toThrow(
                BadRequestException,
            );
            expect(isValidObjectIdMock).toHaveBeenCalledWith(id);
            isValidObjectIdMock.mockRestore();
        });

        it('should throw NotfoundExcetion if book is not found', async() =>{
            jest.spyOn(model, 'findById').mockResolvedValue(null);

            const result = await BookService.findById(mockBook._id);
            expect(model.findById).toHaveBeenCalledWith(mockBook._id);
            expect(result).toEqual(mockBook);

        });
        
    })

});