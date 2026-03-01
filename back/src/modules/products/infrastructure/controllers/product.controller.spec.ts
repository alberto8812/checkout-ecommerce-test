import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductUseCaseService } from '../../application/use-cases/product-use-case.service';
import { CreateProductDto } from '../../application/dto/create-product.dto';
import { UpdateProductDto } from '../../application/dto/update-product.dto';

describe('ProductController', () => {
    let controller: ProductController;

    const mockProductUseCaseService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide: ProductUseCaseService,
                    useValue: mockProductUseCaseService,
                },
            ],
        }).compile();

        controller = module.get<ProductController>(ProductController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a product', async () => {
            const dto: CreateProductDto = { name: 'Test Product', price: 10 };
            const expectedResult = { message: 'success' };

            mockProductUseCaseService.create.mockResolvedValue(expectedResult);

            const result = await controller.create(dto);

            expect(mockProductUseCaseService.create).toHaveBeenCalledWith(dto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should return all products', async () => {
            const expectedResult = [{ id: '1', name: 'Test', price: 10 }];

            mockProductUseCaseService.findAll.mockResolvedValue(expectedResult);

            const result = await controller.findAll();

            expect(mockProductUseCaseService.findAll).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
        it('should return a product by ID', async () => {
            const expectedResult = { id: '1', name: 'Test', price: 10 };

            mockProductUseCaseService.findOne.mockResolvedValue(expectedResult);

            const result = await controller.findOne('1');

            expect(mockProductUseCaseService.findOne).toHaveBeenCalledWith('1');
            expect(result).toEqual(expectedResult);
        });
    });

    describe('update', () => {
        it('should update a product', async () => {
            const dto: UpdateProductDto = { price: 20 };
            const expectedResult = { message: 'success' };

            mockProductUseCaseService.update.mockResolvedValue(expectedResult);

            const result = await controller.update('1', dto);

            expect(mockProductUseCaseService.update).toHaveBeenCalledWith('1', dto);
            expect(result).toEqual(expectedResult);
        });
    });
});
