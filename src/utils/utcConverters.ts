export function utcStartOfDay(d: Date): Date {
    return new Date(
        Date.UTC(
            d.getUTCFullYear(),
            d.getUTCMonth(),
            d.getUTCDate(),
            0,
            0,
            0,
            0
        )
    );
}

export function utcEndOfDay(d: Date): Date {
    return new Date(
        Date.UTC(
            d.getUTCFullYear(),
            d.getUTCMonth(),
            d.getUTCDate(),
            23,
            59,
            59,
            999
        )
    );
}
