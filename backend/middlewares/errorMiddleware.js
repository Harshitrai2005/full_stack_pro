class ErrorHandler extends Error{

    constructor(message,statuscode){
        super(message);
        this.statuscode=statuscode;

    }
}



export const errorMiddleware=(err,req,res,next)=>{
    err.message=err.message||"internal server error";
    err.statuscode=err.statuscode||500;

    if(err.code===11000){
    const statuscode=400;
    const message="duplicate filed value given";
    err=new ErrorHandler(message,statuscode)
    }


if(err.name==="JsonWebTokenError"){
    const statuscode=400;
    const message="json web token is invalid .Try again";
    err= new ErrorHandler(message,statuscode);
}

if(err.name==="TokenExpiredError"){
    const statuscode=400;
    const message="json web token is expired.Try again";
    err=new ErrorHandler(message,statuscode);
}

if(err.name==="CastError"){
    const statuscode=400;
    const message="Resource not found .Try again";
    err= new ErrorHandler(message,statuscode);
}


const errorMessage=err.errors?Object.values(err.errors).map((error)=>error.message).join(" "):err.message;
return res.status(err.statuscode).json({
    success:false,
    message:errorMessage,
});


};

export default ErrorHandler;
