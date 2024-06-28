import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [groupName, setGroupName] = useState('');

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

    const handleCheckboxChange = (name, email) => {
        const contactIdentifier = `${name}-${email}`;
        setSelectedContacts(prevSelectedContacts => 
            prevSelectedContacts.includes(contactIdentifier)
                ? prevSelectedContacts.filter(id => id !== contactIdentifier)
                : [...prevSelectedContacts, contactIdentifier]
        );
    };

    const handleCreateGroupClick = () => {
        setIsCreatingGroup(true);
    };

    const handleGroupNameChange = (event) => {
        setGroupName(event.target.value);
    };

    const handleSubmitGroup = () => {
        axios.post('http://localhost:3001/create-group', { groupName, contacts: selectedContacts })
            .then(response => {
                console.log(response.data);
                // Handle success response
            })
            .catch(error => {
                console.error(error);
                // Handle error response
            });
        setIsCreatingGroup(false);
        setSelectedContacts([]);
        setGroupName('');
    };

    return (
        <div>
            <h1>Contacts</h1>
            <ul>
                {contacts.map(contact => (
                    <li key={`${contact.name}-${contact.email}`}>
                        {isCreatingGroup && 
                            <input 
                                type="checkbox" 
                                checked={selectedContacts.includes(`${contact.name}-${contact.email}`)} 
                                onChange={() => handleCheckboxChange(contact.name, contact.email)}
                            />
                        }
                        {contact.name}: {contact.email}
                    </li>
                ))}
            </ul>
            <button onClick={handleCreateGroupClick}>Create Group</button>
            {isCreatingGroup && (
                <div>
                    <input 
                        type="text" 
                        placeholder="Group Name" 
                        value={groupName} 
                        onChange={handleGroupNameChange} 
                    />
                    <button onClick={handleSubmitGroup}>Submit</button>
                </div>
            )}
        </div>
    );
};

export default Contacts;
