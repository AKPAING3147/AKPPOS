// Mock Data Store for Frontend-Only App

export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: { name: string };
    barcode: string | null;
    isActive: boolean;
}

export interface Order {
    id: string;
    total: number;
    items: { product: { name: string }; quantity: number; price: number }[];
    createdAt: string;
    paymentMethod: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'STAFF';
    createdAt: string;
}

// Initialize mock data
const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Coca Cola',
        price: 1.50,
        stock: 100,
        category: { name: 'Beverages' },
        barcode: '123456789',
        isActive: true,
    },
    {
        id: '2',
        name: 'Snickers Bar',
        price: 0.99,
        stock: 50,
        category: { name: 'Snacks' },
        barcode: '987654321',
        isActive: true,
    },
    {
        id: '3',
        name: 'Notebook A4',
        price: 2.50,
        stock: 30,
        category: { name: 'Stationery' },
        barcode: null,
        isActive: true,
    },
];

const MOCK_ORDERS: Order[] = [
    {
        id: '1',
        total: 5.99,
        items: [
            { product: { name: 'Coca Cola' }, quantity: 2, price: 1.50 },
            { product: { name: 'Snickers Bar' }, quantity: 3, price: 0.99 },
        ],
        createdAt: new Date().toISOString(),
        paymentMethod: 'CASH',
    },
];

const MOCK_USERS: User[] = [
    {
        id: '1',
        name: 'Admin User',
        email: 'admin@pos.com',
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
    },
];

// LocalStorage utilities
export const getMockProducts = (): Product[] => {
    if (typeof window === 'undefined') return MOCK_PRODUCTS;
    const stored = localStorage.getItem('mockProducts');
    return stored ? JSON.parse(stored) : MOCK_PRODUCTS;
};

export const setMockProducts = (products: Product[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('mockProducts', JSON.stringify(products));
    }
};

export const getMockOrders = (): Order[] => {
    if (typeof window === 'undefined') return MOCK_ORDERS;
    const stored = localStorage.getItem('mockOrders');
    return stored ? JSON.parse(stored) : MOCK_ORDERS;
};

export const setMockOrders = (orders: Order[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('mockOrders', JSON.stringify(orders));
    }
};

export const getMockUsers = (): User[] => {
    if (typeof window === 'undefined') return MOCK_USERS;
    const stored = localStorage.getItem('mockUsers');
    return stored ? JSON.parse(stored) : MOCK_USERS;
};

export const setMockUsers = (users: User[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('mockUsers', JSON.stringify(users));
    }
};

// Initialize localStorage on first load
export const initializeMockData = () => {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem('mockProducts')) {
        localStorage.setItem('mockProducts', JSON.stringify(MOCK_PRODUCTS));
    }
    if (!localStorage.getItem('mockOrders')) {
        localStorage.setItem('mockOrders', JSON.stringify(MOCK_ORDERS));
    }
    if (!localStorage.getItem('mockUsers')) {
        localStorage.setItem('mockUsers', JSON.stringify(MOCK_USERS));
    }
};
