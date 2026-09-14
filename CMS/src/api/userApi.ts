import { POST_API } from ".";

export const getStudentsApi = async (props: { reqQuery?: any, reqBody?: any }): Promise<{
    total: number , 
    data: any, 
    status: number
}> => {
    const url = 'alumni/getStudents';
    const res = await POST_API({ url, ...props });
    return res.data ?? {};
}

export const updateStudentApi = async (props: { reqQuery?: any, reqBody?: any }): Promise<{
    data: any, 
    status: number
}> => {
    const url = 'alumni/updateStatus';
    const res = await POST_API({ url, ...props });
    return res.data ?? {};
}