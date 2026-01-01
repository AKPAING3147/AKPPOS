import { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key')

export async function getTenantFromRequest(request: NextRequest): Promise<string | null> {
    try {
        const token = request.cookies.get('token')?.value

        if (!token) {
            return null
        }

        const { payload } = await jwtVerify(token, JWT_SECRET)
        return payload.tenantId as string || null
    } catch (error) {
        console.error('Error extracting tenant from token:', error)
        return null
    }
}

export async function getUserFromRequest(request: NextRequest): Promise<{
    id: string
    email: string
    role: string
    tenantId: string
} | null> {
    try {
        const token = request.cookies.get('token')?.value

        if (!token) {
            return null
        }

        const { payload } = await jwtVerify(token, JWT_SECRET)

        if (!payload.id || !payload.tenantId) {
            return null
        }

        return {
            id: payload.id as string,
            email: payload.email as string,
            role: payload.role as string,
            tenantId: payload.tenantId as string,
        }
    } catch (error) {
        console.error('Error extracting user from token:', error)
        return null
    }
}
