import { ImageSourcePropType } from 'react-native';

const photosByEmail: Record<string, ImageSourcePropType> = {
  'maria.demo@takere.test': require('../../assets/profilePhotos/maria.png'),
  'carlos.demo@takere.test': require('../../assets/profilePhotos/carlos.png'),
  'ana.demo@takere.test': require('../../assets/profilePhotos/ana.png'),
};

export function getProfilePhoto(
  email: string | null | undefined,
): ImageSourcePropType | undefined {
  if (!email) return undefined;
  return photosByEmail[email.toLowerCase()];
}
