/**
 * Represents emergency contact information.
 */
export interface EmergencyContact {
  /**
   * The contact's name.
   */
  name: string;
  /**
   * The contact's phone number.
   */
  phoneNumber: string;
}

/**
 * Sends the user's current location and medical information to their emergency contacts.
 *
 * @param location The current location of the user.
 * @param medicalInfo A string containing the user's medical information.
 * @param emergencyContacts An array of EmergencyContact objects representing the user's emergency contacts.
 * @returns A promise that resolves to void.
 */
export async function sendEmergencyAlert(
  location: { lat: number; lng: number },
  medicalInfo: string,
  emergencyContacts: EmergencyContact[]
): Promise<void> {
  // TODO: Implement this by calling an API.
  console.log(
    `Sending emergency alert to contacts with location ${location} and medical info ${medicalInfo}`
  );
}
