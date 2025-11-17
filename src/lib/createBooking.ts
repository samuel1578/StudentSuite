import { Account, Databases, Models, Permission, Role } from 'appwrite';
import client from '../appwrite';

const account = new Account(client);
const databases = new Databases(client);

const DATABASE_ID = '691b378400072f91e003';
const BOOKINGS_COLLECTION_ID = 'bookings';

export async function createBooking(
    bookingData: Record<string, unknown>
): Promise<Models.Document | null> {
    try {
        const session = await account.getSession('current');
        const userId = session.userId;

        const dataWithOwner = { ...bookingData, userId };

        console.log('createBooking using IDs:', {
            databaseId: DATABASE_ID,
            collectionId: BOOKINGS_COLLECTION_ID
        });

        const document = await databases.createDocument(
            DATABASE_ID,
            BOOKINGS_COLLECTION_ID,
            'unique()',
            dataWithOwner,
            [
                // Read access limited to the creator keeps personal booking details private.
                Permission.read(Role.user(userId)),
                // Update access restricted to the creator so only they can modify their booking.
                Permission.update(Role.user(userId)),
                // Delete access restricted to the creator to prevent other users from removing it.
                Permission.delete(Role.user(userId))
            ]
        );

        return document;
    } catch (error) {
        console.error('Failed to create booking:', error);
        return null;
    }
}
