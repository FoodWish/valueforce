import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const page = async() => {

    const session = await getServerSession(authOptions);
    console.log(session)

    if (session?.user){
        return <div>Admin Page {session?.user.username}</div>
    }

    return <div>Not Authorized</div>

   
}

export default page;