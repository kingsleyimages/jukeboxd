import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard";
import styles from "../css/AlbumDetails.module.css";

const AlbumDetails = ({ token }) => {
	const { albumId } = useParams();
	const [album, setAlbum] = useState(null);
	const [reviews, setReviews] = useState([]);
	const [userId, setUserId] = useState(null);
	const [editingReview, setEditingReview] = useState(null);
	const [loading, setLoading] = useState(true);
	const [formData, setFormData] = useState({
		headline: "",
		review: "",
		rating: 1,
		favorite: false,
	});

	const API_BASE_URL =
		import.meta.env.VITE_API_BASE_URL_PROD ||
		import.meta.env.VITE_API_BASE_URL_DEV;

	useEffect(() => {
		const fetchAlbumDetails = async () => {
			try {
				const response = await fetch(
					`${API_BASE_URL}/api/albums/${albumId}`
				);
				const data = await response.json();
				setAlbum(data);
				setReviews(data.reviews || []);
			} catch (error) {
				console.error("Error fetching album details:", error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchAlbumDetails();

		if (token) {
			try {
				const payload = JSON.parse(atob(token.split(".")[1]));
				if (payload && payload.id) {
					setUserId(payload.id);
				}
			} catch (error) {
				console.error("Invalid token format:", error.message);
			}
		}
	}, [albumId, token]);

	const markAsListenedFrontEnd = async (albumId, token) => {
		if (!albumId) {
			console.error("Error: albumId is undefined");
			return;
		}

		if (!token) {
			alert("You need to be logged in to mark album as listened");
			return;
		}

		try {
			const url = `${API_BASE_URL}/api/reviews/albums/${albumId}/listened`;
			console.log("📡 Sending API Request to:", url);

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				console.log("Album marked as listened");
			} else {
				console.error(
					"Failed to mark album as listened:",
					response.statusText
				);
			}
		} catch (err) {
			console.error("Error marking album as listened:", err.message);
		}
	};

	const handleSubmitReview = async (e) => {
		e.preventDefault();
		if (!token) {
			alert("You need to be logged in to leave a review");
			return;
		}

		try {
			const url = editingReview
				? `${API_BASE_URL}/api/reviews/${editingReview.id}/update`
				: `${API_BASE_URL}/api/reviews/album/${albumId}/create`;

			const method = editingReview ? "PUT" : "POST";
			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				const updatedReview = await response.json().catch(() => null);
				setReviews((prevReviews) =>
					prevReviews.map((review) =>
						review.id === updatedReview.id ? updatedReview : review
					)
				);
				setEditingReview(null);
				setFormData({
					headline: "",
					review: "",
					rating: 1,
					favorite: false,
				});
			} else {
				console.error("Failed to save review");
			}
		} catch (err) {
			console.error("Error saving review:", err.message);
		}
	};

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleCancelEdit = () => {
		setEditingReview(null);
		setFormData({
			headline: "",
			review: "",
			rating: 1,
			favorite: false,
		});
	};

	const handleEditClick = (review) => {
		setEditingReview(review);
		setFormData({
			headline: review.headline,
			review: review.review,
			rating: review.rating,
			favorite: review.favorite,
		});
		console.log("Edit review:", review);
	};

	if (!album) return <div>Loading...</div>;

	const handleDeleteClick = async (review) => {
		if (
			!window.confirm("Are you sure you want to delete this review?")
		)
			return;
		try {
			const response = await fetch(
				`${API_BASE_URL}/api/reviews/${review.id}/delete`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.ok) {
				setReviews((prevReviews) =>
					prevReviews.filter((r) => r.id !== review.id)
				);
			} else {
				alert("Failed to delete the review. Please try again.");
			}
		} catch (error) {
			console.error("Error deleting review:", error);
			alert("An error occurred while deleting the review.");
		}
	};

	if (loading) return <div>Loading...</div>;
	if (!album) return <div>Album not found.</div>;

	const averageRating =
		reviews.length > 0
			? (
					reviews.reduce((acc, review) => acc + review.rating, 0) /
					reviews.length
			  ).toFixed(1)
			: null;

	return (
		<div>
			<div className={styles.topContainer}>
				<div className={styles.albumWrapper}>
					<h1 className={styles.title}>{album.name}</h1>
					<p className={styles.artist}>{album.artist}</p>
					<img
						className={styles.img}
						src={album.image}
						alt={album.name}
					/>
					{averageRating && <p>Average Rating: {averageRating} /5</p>}
					{album?.tracks?.length > 0 ? (
						album.tracks.map((track) => (
							<p key={track.id}>
								{track.track_number}. {track.title}
							</p>
						))
					) : (
						<p>No tracks for this album</p>
					)}
				</div>
				{token && (
					<form
						onSubmit={handleSubmitReview}
						className={styles.formContainer}
					>
						<h2>
							{editingReview ? "Edit Review" : "Leave a Review"}
						</h2>
						<input
							type="text"
							name="headline"
							placeholder="Headline"
							value={formData.headline}
							onChange={(e) =>
								setFormData({ ...formData, headline: e.target.value })
							}
							required
						/>
						<textarea
							name="review"
							placeholder="Write your review..."
							value={formData.review}
							onChange={(e) =>
								setFormData({ ...formData, review: e.target.value })
							}
							required
						/>
						<input
							type="number"
							name="rating"
							min="1"
							max="5"
							value={formData.rating}
							onChange={(e) =>
								setFormData({
									...formData,
									rating: Number(e.target.value),
								})
							}
							required
						/>
						<button type="submit">
							{editingReview ? "Update Review" : "Submit Review"}
						</button>
					</form>
				)}
			</div>
			<div className={styles.reviewContainer}>
				<h2 className={styles.reviewTitle}>Reviews:</h2>
				{reviews.length > 0 ? (
					reviews.map((review) => (
						<ReviewCard
							key={review.id}
							review={review}
							userId={userId}
							onDeleteClick={handleDeleteClick}
						/>
					))
				) : (
					<p>No Reviews for this album</p>
				)}
				<button
					className={styles.button}
					onClick={() => markAsListenedFrontEnd(albumId, token)}
					disabled={album.listened}
				>
					{album.listened ? "Already Listened" : "Mark as Listened"}
				</button>
			</div>
		</div>
	);
};

export default AlbumDetails;
