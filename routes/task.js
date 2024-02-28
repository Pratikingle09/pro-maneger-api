const express = require("express");
const router = express.Router();
const Task = require("../model/taskData");
const verifyJwt = require("../middlewares/authMiddleware");

router.post("/posttask/:id",verifyJwt, async (req, res) => {
  const { id: userId } = req.params;
  const { title, priority, todos, dueDate } = req.body;
  if (!title || !priority || !todos || !userId) {
    return res.status(400).json({
      errorMessage: "Bad Request",
    });
  }
  const taskData = await Task.create({
    title,
    priority,
    todos,
    dueDate,
    userId,
  });

  res.status(200).json({ message: "success", taskData });
});

router.patch('/movetoblog/:id',verifyJwt,async(req,res)=>{
  const {id:taskId} = req.params;
  const {blog} = req.body;
  if(!blog || !taskId)
  {
    return res.status(400).json({errorMessage:'Bad Request'})
  }
  try {
    const response = await Task.updateOne(
      {_id:taskId},
      { $set:{blog}}
    )
    if(response)
    {
      res.status(200).json({message:'updated successfully'})
    }
  } catch (error) {
    console.log(error)
  }

  })


  router.get("/gettask/:id",verifyJwt, async (req, res) => {
    const { id: userId } = req.params;
  
    if (!userId) {
      return res.status(400).json({ errorMessage: "Bad Request" });
    }
    
    try {
      const tasks = await Task.find({ userId: userId });

      if (!tasks || tasks.length === 0) {
        return res.status(404).json({ errorMessage: "Tasks not found" });
      }
  
      // Organizing tasks by blog
      const stepWiseData = {};
      tasks.forEach(task => {
        if (stepWiseData[task.blog]) {
          stepWiseData[task.blog].push(task);
        } else {
          stepWiseData[task.blog] = [task];
        }
      });
  
  
      res.status(200).json(stepWiseData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ errorMessage: "Internal Server Error" });
    }
  });
  

router.delete('/deletetask/:id',verifyJwt,async(req,res)=>{
  const {id:taskId}=req.params
  if(!taskId)
  {
    return res.status(400).json({
      errorMessage: "Bad Request",
    });
  }
  try {
    const response = await Task.findByIdAndDelete({_id:taskId})
    res.status(200).json({response})
  } catch (error) {
    res.status(400).json({errorMessage:error})
  }


})


router.patch('/edittask/:id',verifyJwt, async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const { userId, title, priority, todos, dueDate } = req.body;
    
    
    if (!taskId || !userId || !title || !priority || !todos) {
      return res.status(400).json({
        errorMessage: "Bad Request: Missing required fields",
      });
    }
    
    const response = await Task.updateOne(
      { _id: taskId },
      { $set: { userId, title, priority, todos, dueDate,updatedAt:Date.now() } }
    );

    if (response) {
      return res.status(200).json({ message: "Task updated successfully" });
    } else {
      return res.status(404).json({ errorMessage: "Task not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ errorMessage: 'Something went wrong' });
  }
});

router.get('/sharetask/:id',async(req,res)=>{
  try {
  const {id:taskId}=req.params;
  if(!taskId)
  {
    return res.status(404).json({errorMessage:'Task Not Found'})
  }
  const responce = await Task.findOne({_id:taskId})
  if(responce)
  {
    res.status(200).json({responce})
  }
} catch (error) {
  return res.status(500).json({errorMessage:'Something went wrong'})
}
})



module.exports = router;
