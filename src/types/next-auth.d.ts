import 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            name: string
            email: string
            // Add any additional properties
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
        // Add any additional properties
    }
}
