import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        const fetchContacts = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    console.log("The token is ", token);
                    const response = await axios.get('http://localhost:3001/contacts', {
                        params: {
                            access_token: token,
                        },
                    });
                    // Process the response to create simplified contacts array with IDs
                    const processedContacts = response.data
                        .filter(contact => contact.emailAddresses && contact.emailAddresses.length > 0)
                        .map((contact, index) => ({
                            id: index + 1, // Assign incrementing ID starting from 1
                            name: contact.names && contact.names.length > 0 ? contact.names[0].displayName : 'No Name',
                            email: contact.emailAddresses[0].value // Assume there's at least one email address
                        }));

                    setContacts(processedContacts);
                } catch (error) {
                    console.error('Error fetching contacts', error);
                }
            }
        };

        fetchContacts();
    }, []);

    return (
        <div>
            <h1>Contacts</h1>
            <ul>
                {contacts.map(contact => (
                    <li key={contact.id}>{contact.id}: {contact.name} {contact.email} </li>
                ))}
            </ul>
        </div>
    );
};

export default Contacts;
