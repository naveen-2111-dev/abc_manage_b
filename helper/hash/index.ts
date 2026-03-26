import bcrypt from "bcrypt";

export class Hash {
    private readonly value: string;

    constructor(value: string) {
        this.value = value;
    }

    async hash(saltRounds: number = 10): Promise<string> {
        return await bcrypt.hash(this.value, saltRounds);
    }

    async compare(hashedValue: string): Promise<boolean> {
        return await bcrypt.compare(this.value, hashedValue);
    }
}