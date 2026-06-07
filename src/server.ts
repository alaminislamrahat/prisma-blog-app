import app from "./app"
import { prisma } from "./lib/prisma"


const PORT = process.env.PORT || 3000;

async function main (){
    try{
        await prisma.$connect()
        console.log("connected to the database successfully")


        app.listen(PORT,()=>{
            console.log(`app is running on port http://localhost:${PORT}`)
        })
    }
    catch(err){
        console.error("err", err)
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();