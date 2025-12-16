import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Sauvegarde des données locales
 * @param key clé pour stocker la donnée
 * @param value valeur à stocker
 */
export const saveLocalData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.log("Erreur lors de la sauvegarde des données:", error);
  }
};

/**
 * Récupère des données locales
 * @param key clé de la donnée
 * @returns valeur stockée ou null si aucune donnée
 */
export const getLocalData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log("Erreur lors de la récupération des données:", error);
    return null;
  }
};

/**
 * Supprime une donnée locale
 * @param key clé de la donnée à supprimer
 */
export const removeLocalData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log("Erreur lors de la suppression des données:", error);
  }
};
