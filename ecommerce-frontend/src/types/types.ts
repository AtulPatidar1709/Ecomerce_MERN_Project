export type User = {
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    dob: string;
    _id: string;
}

export type Product = {
    name: string;
    price: number;
    stock: number;
    category: string;
    photo: string;
    _id: string;
}

export type ShippingInfo = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
}

export type CartItem = {
    productId: string;
    photo: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
}


export type OrderItem = Omit<CartItem, "stock"> & { _id: string };

export type Order = {
    orderItems: OrderItem[];
    shippingInfo: ShippingInfo;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    status: string;
    user: {
        name: string;
        _id: string;
    };
    _id: string;
}

type CountAndChange = {
    revenue: number;
    product: number;
    user: number;
    order: number;
}

type LatestTransection = {
    _id: string;
    amount: number;
    discount: number;
    quantity: number;
    status: string;
}

export type Stats = {
    categoryCount: Record<string, number>[],
    changePercent: CountAndChange,
    count: CountAndChange,
    chart: {
        order: number[],
        revenue: number[],
    },
    UserRatio: {
        male: number,
        female: number,
    },
    lastestTransaction: LatestTransection[],
}

type RevenueDistributionTypes = {
    totalGrossIncome: number;
    netMargin: number;
    discount: number;
    productionCost: number;
    burnt: number;
    marketingCost: number;
}

type OrderFullFillment = {
    processing: number;
    shipped: number;
    delivered: number;
}

type StockAvailability = {
    inStock: number;
    outOfStock: number;
}

type UsersAgeGroup = {
    teen: number;
    adult: number;
    old: number;
}


export type Pie = {
    orderFullFillment: OrderFullFillment,
    productCategories: Record<string, number>[],
    stockAvailability: StockAvailability,
    revenueDistribution: RevenueDistributionTypes,
    usersAgeGroup: UsersAgeGroup,
    adminCustomer: {
        admin: number;
        customer: number;
    }
}

export type Bar = {
    users: number[];
    products: number[];
    orders: number[];
}

export type Line = {
    users: number[];
    products: number[];
    discount: number[];
    revenue: number[];
}