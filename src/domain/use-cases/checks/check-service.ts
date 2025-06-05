interface CheckServiceUseCase {
    execute(url: string): Promise<boolean>;
}

type SuccessCallback = () => void;
type ErrorCallback = (error: string) => void;

export class CheckService implements CheckServiceUseCase {
    constructor(private readonly successCallback: SuccessCallback, private readonly errorCallback: ErrorCallback)
    {
    }

    async execute(url: string): Promise<boolean> {
        try {
            const req: Response = await fetch(url);

            if (!req.ok) {
                throw new Error(`${url} not ok`);
            }

            this.successCallback();
            return true;
        } catch (error: any) {
            console.error(error);
            this.errorCallback(error.toString())
            return false;
        }
    }
}