import { app } from "./start";


/**
* App Variables
*/


const PORT = 8080;


/**
* Server Activation
*/


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});