import { useEffect, useState } from 'react';
import { Heart } from 'react-feather';

import UserService from '../../services/UserService';

interface FavoriteButtonProps {
  userId: string;
  courseId: string;
  className?: string;
}

export default function FavoriteButton({
  userId,
  courseId,
  className = '',
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favorites = await UserService.getFavoriteCourses(userId);
        setIsFavorite(favorites.some((course) => course.id === courseId));
      } catch (error) {
        console.error('Error checking favorite status', error);
      }
    };
    checkFavoriteStatus();
  }, [userId, courseId]);

  const toggleFavorite = async () => {
    setIsLoading(true);
    try {
      if (isFavorite) {
        await UserService.removeFavoriteCourse(userId, courseId);
        alert('Curso quitado de favoritos');
      } else {
        await UserService.addFavoriteCourse(userId, courseId);
        alert('Curso agregado a favoritos');
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`flex flex-col items-center focus:outline-none ${className} ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        size={20}
        fill={isFavorite ? 'currentColor' : 'none'}
        color={isFavorite ? 'red' : 'currentColor'}
        className="mb-1"
      />
      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
        {isFavorite ? 'Quitar favorito' : 'Agregar a favoritos'}
      </span>
    </button>
  );
}
