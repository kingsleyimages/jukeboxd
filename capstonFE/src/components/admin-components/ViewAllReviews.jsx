import React, {useEffect, useState} from 'react'

// This component will be used to view all reviews
function ViewAllReviews() {
    // Set the initial state of the reviews
    const [reviews, setReviews] = useState([]);
    // Set the initial state of the error message
    const [errorMessage, setErrorMessage] = useState("");
    // Set the initial state of the loading message
    const [isLoading, setIsLoading] = useState(true);
    

    // Use the useEffect hook to fetch the reviews from the API
    useEffect(() => {
        const token = localStorage.getItem('token'); 
        console.log('Fetching reviews...');
        fetch('http://localhost:3000/api/reviews', {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
        .then((response) => {
            console.log('Response:', response); // Log the response
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Fetched reviews:', data); // Log the fetched data
            setReviews(data);
            setIsLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching reviews:', error); // Log the error
            setErrorMessage("An error occurred while fetching reviews");
            setIsLoading(false);
        });
    }, []);
  return (
    <>
     <div>ViewAllReviews</div>
        <ul>
            {reviews.map((review) => (
            <li key={review.id}>{review.review}</li>
            ))}
        </ul>
    </>
   

  )
}

export default ViewAllReviews