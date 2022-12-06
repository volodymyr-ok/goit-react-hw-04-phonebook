import { useState, useEffect } from 'react';
import { Contacts } from './Contacts/Contacts';
import { Filter } from './Filter/Filter';
import { Form } from './Form/Form';
import { StyledH2 } from './App.styled';
const LS_CS_KEY = `contacts_list`;

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const savedContacts = localStorage.getItem(LS_CS_KEY);
    if (!savedContacts) {
      return;
    }
    setContacts(JSON.parse(savedContacts));
  }, []);

  useEffect(() => {
    if (!contacts.length) {
      return;
    }
    localStorage.setItem(LS_CS_KEY, JSON.stringify(contacts));
    // ПИТАННЯ: Чому localStorage.setItem з цього useEffect'у спрацьовує раніше за localStorage.getItem з useEffect'у вище? Через те що при перезавантаженні в мене постійно пустий масив (в стейті) - я вимушений робити перевірку на порожність масиву перед зберіганням його в сховище... Це асинхронні функції?
  }, [contacts]);

  const contactsHandler = data => {
    const contactsCheking = contact => {
      if (contact.name === data.name) {
        alert(`${data.name} is already in contacts.`);
        return contact;
      } else if (contact.number === data.number) {
        alert(
          `This number (${data.number}) is already in ${contact.name} contact.`
        );
        return contact;
      }
    };
    const inContactList = contacts.map(contactsCheking).length;

    if (!inContactList) {
      setContacts([data, ...contacts]);
    }
  };

  const handleFilter = event => {
    setFilter(event.target.value.toLowerCase());
  };

  const filteredContacts = () => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter)
    );
  };

  const deleteContactHandler = name => {
    setContacts(contacts.filter(contact => contact.name !== name));
  };

  return (
    <>
      <StyledH2>Phonebook</StyledH2>
      <Form contactsHandler={contactsHandler} />

      <StyledH2>Contacts</StyledH2>
      <Filter onChange={handleFilter} value={filter} />
      <Contacts contacts={filteredContacts()} onDelete={deleteContactHandler} />
    </>
  );
};
