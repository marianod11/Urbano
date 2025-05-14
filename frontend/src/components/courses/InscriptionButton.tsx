// components/EnrollButton.tsx
import { useEffect, useState } from 'react';
import { BookOpen, Loader } from 'react-feather';

import UserService from '../../services/UserService';

interface EnrollButtonProps {
  userId: string;
  courseId: string;
  className?: string;
}

export default function EnrollButton({
  userId,
  courseId,
  className = '',
}: EnrollButtonProps) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      try {
        const coursesInscription = await UserService.getInscriptionCourses(
          userId,
        );
        setIsEnrolled(
          coursesInscription?.some((course) => course.id === courseId) || false,
        );
      } catch (error) {
        console.error('Error checking enrollment status', error);
      }
    };
    checkEnrollmentStatus();
  }, [userId, courseId]);

  const toggleEnrollment = async () => {
    setIsLoading(true);
    try {
      if (isEnrolled) {
        await UserService.removeInscriptionCourse(courseId, userId);
        alert('Se desinscribió correctamente del curso');
      } else {
        await UserService.addInscriptionCourse(courseId, userId);
        alert('Se inscribió correctamente al curso');
      }
      setIsEnrolled(!isEnrolled);
    } catch (error) {
      console.error('Error toggling enrollment', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleEnrollment}
      disabled={isLoading}
      className={`group flex flex-col items-center focus:outline-none ${className} ${
        isLoading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      aria-label={isEnrolled ? 'Salir del curso' : 'Inscribirse al curso'}
    >
      <div className="relative">
        <BookOpen
          size={20}
          className={`mb-1 transition-colors ${
            isEnrolled
              ? 'text-green-600 fill-green-100'
              : 'text-gray-600 dark:text-gray-300'
          } group-hover:scale-110`}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader className="animate-spin" size={16} />
          </div>
        )}
      </div>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 transition-all">
        {isLoading ? (
          <span className="inline-block animate-pulse">Procesando...</span>
        ) : (
          <span className="group-hover:underline">
            {isEnrolled ? 'Salir del curso' : 'Inscribirse'}
          </span>
        )}
      </span>
    </button>
  );
}
