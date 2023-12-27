export class Logger {
    static info(moduleName: string, methodOrFunctionName: string, message: string) {
        console.info(`${moduleName}::${methodOrFunctionName}::${message}`)
    }

    static warn(moduleName: string, methodOrFunctionName: string, message: string) {
        console.warn(`${moduleName}::${methodOrFunctionName}::${message}`)
    }

    static error(moduleName: string, methodOrFunctionName: string, message: string) {
        console.error(`${moduleName}::${methodOrFunctionName}::${message}`)
    }
}