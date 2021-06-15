import axios from 'axios';


const authMiddleware = {

    jwtTest: async (req, res) => {
        try {
         
            axios({
                method: 'post',
                url: `http://localhost:3000/test`,
                data: {
                    email: "test",
                    password: "test",
                },
                headers: {
                    'Authorization': `Basic ${token}`
                  },
                })
                .then(res => {
                    console.log(res)
                            
                })



        } catch (error) {
         //console.trace(error);
         res
          .status(500)
          .json({ error: `Server error, please contact an administrator` });
        }
    },



};
        
export default authMiddleware;