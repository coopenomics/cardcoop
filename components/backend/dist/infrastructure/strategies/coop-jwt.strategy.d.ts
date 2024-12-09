declare const CoopJwtStrategy_base: new (...args: any[]) => any;
export declare class CoopJwtStrategy extends CoopJwtStrategy_base {
    constructor();
    validate(payload: any): Promise<{
        username: any;
        coopName: any;
    }>;
}
export {};
