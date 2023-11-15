// import { NextResponse } from 'next/server'

// // the list of all allowed origins
// const allowedOrigins = ['http://localhost:3799', '']

// export function middleware(req: Request) {
//   const res = NextResponse.next()

//   req.headers.get('origin')

//   if (allowedOrigins.includes(origin)) {
//     res.headers.append('Access-Control-Allow-Origin', origin)
//   }

//   // add the remaining CORS headers to the response
//   res.headers.append('Access-Control-Allow-Credentials', 'true')
//   res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
//   res.headers.append(
//     'Access-Control-Allow-Headers',
//     'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//   )

//   return res
// }

// export const config = {
//   matcher: '/api/:path*',
// }
