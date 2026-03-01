import { Test, TestingModule } from '@nestjs/testing';
import { ProductUseCaseService } from './product-use-case.service';
import { PRODUCT_REPOSITORY } from '../../domain/repository/product.repository.interface';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

describe('ProductUseCaseService', () => {
    let service: ProductUseCaseService;

    const mockProductRepository = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductUseCaseService,
                {
                    provide: PRODUCT_REPOSITORY,
                    useValue: mockProductRepository,
                },
            ],
        }).compile();

        service = module.get<ProductUseCaseService>(ProductUseCaseService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a product', async () => {
            const dto: CreateProductDto = { name: 'Prod1', price: 100 };
            const expectedResult = { message: 'Producto creado con exito' };

            mockProductRepository.create.mockResolvedValue(expectedResult);

            const result = await service.create(dto);

            expect(mockProductRepository.create).toHaveBeenCalledWith(dto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should return all products', async () => {
            const expectedProducts = [
                { id: '1', name: 'Prod1', price: 100 },
                { id: '2', name: 'Prod2', price: 200 },
            ];

            mockProductRepository.findAll.mockResolvedValue(expectedProducts);

            const result = await service.findAll();

            expect(mockProductRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(expectedProducts);
        });
    });

    describe('findOne', () => {
        it('should return a product by id', async () => {
            const expectedProduct = { id: '1', name: 'Prod1', price: 100 };

            mockProductRepository.findOne.mockResolvedValue(expectedProduct);

            const result = await service.findOne('1');

            expect(mockProductRepository.findOne).toHaveBeenCalledWith('1');
            expect(result).toEqual(expectedProduct);
        });
    });

    describe('update', () => {
        it('should update a product', async () => {
            const dto: UpdateProductDto = { price: 150 };
            const expectedResult = { message: 'Producto actualizado con exito' };

            mockProductRepository.update.mockResolvedValue(expectedResult);

            const result = await service.update('1', dto);

            expect(mockProductRepository.update).toHaveBeenCalledWith('1', dto);
            expect(result).toEqual(expectedResult);
        });
    });
});
