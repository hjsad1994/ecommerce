import { ShopEntity } from '../../domain/entities/Shop.entity';
import { Email } from '../../domain/value-objects/Email.vo';
import { IShopRepository } from '../../domain/repositories/IShopRepository';
import { ITokenService } from '../interfaces/ITokenService';
import { RegisterShopDTO } from '../dto/RegisterShopDTO';
import { AuthTokensDTO } from '../dto/AuthTokensDTO';

export interface RegisterShopResponse {
    shop: {
        id: string;
        name: string;
        email: string;
        status: string;
        roles: string[];
    };
    tokens: AuthTokensDTO;
}

export class RegisterShopUseCase {
    constructor(
        private shopRepository: IShopRepository,
        private tokenService: ITokenService
    ) {}

    async execute(dto: RegisterShopDTO): Promise<RegisterShopResponse> {
        // 1. Validate input
        const email = new Email(dto.email);
        this.validateInput(dto);

        // 2. Check if shop already exists
        const existingShop = await this.shopRepository.findByEmail(email);
        if (existingShop) {
            throw new Error('Shop with this email already exists');
        }

        // 3. Create new shop entity
        const shop = await ShopEntity.create(dto.name, dto.email, dto.password);

        // 4. Save to repository
        const savedShop = await this.shopRepository.save(shop);

        // 5. Generate tokens
        const tokens = await this.tokenService.generateTokens({
            userId: savedShop.id.toString(),
            email: savedShop.getEmail,
            roles: savedShop.getRoles
        });

        // 6. Return response
        return {
            shop: {
                id: savedShop.id.toString(),
                name: savedShop.getName,
                email: savedShop.getEmail,
                status: savedShop.getStatus,
                roles: savedShop.getRoles
            },
            tokens
        };
    }

    private validateInput(dto: RegisterShopDTO): void {
        if (!dto.name || dto.name.trim().length === 0) {
            throw new Error('Shop name is required');
        }

        if (!dto.password || dto.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        if (dto.name.length > 150) {
            throw new Error('Shop name is too long');
        }
    }
} 