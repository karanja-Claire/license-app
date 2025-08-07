export class CreateProductDto {
    name: string;
    fields: {
        name: string;
        type: 'string' | 'number' | 'date' | 'boolean';
        required: boolean;
    }[];
}