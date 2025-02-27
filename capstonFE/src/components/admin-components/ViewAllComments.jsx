import React, { useEffect, useState } from 'react'
//This component will be used to view all comments


function ViewAllComments() {
    
    const [comments, setComments] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [successMessage, setSuccessMessage] = useState("")
    const [searchQuery, setSearchQuery] = useState("")

    // Use the useEffect hook to fetch the comments from the API
    useEffect(() => {
        fetch('http://localhost:3000:/api/comments')
            .then((response) => response.json())
            .then((data) => {
                setComments(data)
                setIsLoading(false)
            })
            .catch((error) => {
                setErrorMessage("An error occurred while fetching comments")
                setIsLoading(false)
            })
    }, [])
  return (
    <>  
     <div>ViewAllComments</div>
     <ul>
          {comments.map((comment) => (
          <li key={comment.id}>{comment.comment}</li>
          ))}
     </ul>
    </>
   
  )
}

export default ViewAllComments