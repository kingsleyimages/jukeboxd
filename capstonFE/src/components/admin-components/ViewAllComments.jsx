import React, { useEffect, useState } from 'react'
//This component will be used to view all comments


function ViewAllComments() {
    // Set the initial state of the comments
    const [comments, setComments] = useState([])
    // Set the initial state of the error message
    const [errorMessage, setErrorMessage] = useState("")
    // Set the initial state of the loading message
    const [isLoading, setIsLoading] = useState(true)
    // Set the initial state of the success message
    const [successMessage, setSuccessMessage] = useState("")
    // Set the initial state of the search query
    const [searchQuery, setSearchQuery] = useState("")

    // Use the useEffect hook to fetch the comments from the API
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/comments`)
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
    <div>ViewAllCOmments</div>
  )
}

export default ViewAllComments