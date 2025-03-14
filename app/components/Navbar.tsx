'use client';

import { Box, Button, ButtonIcon, SearchIcon, Input, InputField, Icon, Text, Link } from '@gluestack-ui/themed';
import { Search, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react';
import Select, { components } from 'react-select';

interface Concept {
    value: string;
    label: string;
}

const Navbar: React.FC = () => {
    const [concepts, setConcepts] = useState<Concept[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTerm, setSelectedTerm] = useState('');
    const router = useRouter();

    const fetchConcepts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/getAllConceptMap');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (!data.allConceptMap || Object.keys(data.allConceptMap).length === 0) {
                throw new Error('No concepts found in the response');
            }

            const conceptsArray: Concept[] = Object.entries(data.allConceptMap).map(([key, value]) => ({
                value: key,
                label: String(value),
            }));

            conceptsArray.sort((a, b) => a.label.localeCompare(b.label));
            
            setConcepts(conceptsArray);
        } catch (error) {
            console.error('Errore durante il fetch dei concetti:', error);
            setError('Failed to load concepts. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConcepts();
    }, []);

    const handleNavigation = (selectedOption: Concept | null) => {
        if (selectedOption) {
            const parts = selectedOption.value.split('/');

            if (parts.length >= 3) {
                const vocabulary = parts[parts.length - 2];
                const term = parts[parts.length - 1];

                router.push(`/${vocabulary}/${term}`);
            } else {
                console.warn("URL non valido: ",  selectedOption.value);
                router.push(selectedOption.value);
            }
        }
    };

    const DropdownIndicator = (props: any) => {
        return (
            <components.DropdownIndicator {...props}>
                <Search
                    size={16}
                    onClick={() => handleNavigation(props.selectProps.value)}
                />
            </components.DropdownIndicator>
        );
    };

    return (
        <Box
            flexDirection='row'
            padding={8}
            alignItems='center'
            justifyContent='space-between'
            borderBottomWidth={1}
            borderBottomColor='#ddd'
            h={61}
            bg='$white'
        >
            <Box w='33%' flexDirection='row'>
                <Link href='/'><img
                    id="imgLogo"
                    width={125}
                    height={40}
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABACAYAAABfuzgrAAAA0GVYSWZJSSoACAAAAAoAAAEEAAEAAADIAAAAAQEEAAEAAABAAAAAAgEDAAMAAACGAAAAEgEDAAEAAAABAAAAGgEFAAEAAACMAAAAGwEFAAEAAACUAAAAKAEDAAEAAAADAAAAMQECAA0AAACcAAAAMgECABQAAACqAAAAaYcEAAEAAAC+AAAAAAAAAAgACAAIACMuAAAyAAAAIy4AADIAAABHSU1QIDIuMTAuMzgAADIwMjQ6MDY6MjYgMTE6NDQ6NTIAAQABoAMAAQAAAAEAAAAAAAAAhOcGJAAAAYRpQ0NQSUNDIHByb2ZpbGUAAHicfZE9SMNAHMVfU7VFKg52kOKQoTrZRYs41ioUoUKoFVp1MLn0C5q0JCkujoJrwcGPxaqDi7OuDq6CIPgB4uzgpOgiJf4vKbSI8eC4H+/uPe7eAUKryjSzLwFoumVkUkkxl18VA68YQARBxBGVmVmfk6Q0PMfXPXx8vYvxLO9zf44htWAywCcSJ1jdsIg3iGc2rTrnfeIwK8sq8TnxpEEXJH7kuuLyG+eSwwLPDBvZzDxxmFgs9bDSw6xsaMRx4qiq6ZQv5FxWOW9x1qoN1rknf2GooK8sc53mGFJYxBIkiFDQQAVVWIjRqpNiIkP7SQ9/xPFL5FLIVQEjxwJq0CA7fvA/+N2tWZyecpNCSaD/xbY/xoHALtBu2vb3sW23TwD/M3Cld/21FjD7SXqzq0WPgOFt4OK6qyl7wOUOMPpUlw3Zkfw0hWIReD+jb8oDI7fA4JrbW2cfpw9AlrpK3wAHh8BEibLXPd4d7O3t3zOd/n4A3X9y0UPVxKsAAA5baVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA0LjQuMC1FeGl2MiI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICB4bWxuczpHSU1QPSJodHRwOi8vd3d3LmdpbXAub3JnL3htcC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjQxNTg0NmI1LWZhMmQtNDVmNy05YTAwLThiOGY0NDVlMjA0MSIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplZjk4ZTY3My00YjFhLTQ0OGUtYjZhZS0xOWYxNzUzNTA5ZjgiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphM2ExNmU1ZC1mNDFjLTRmNDAtODBhNi05ZWI1ZjEzNDc1ZTkiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBHSU1QOkFQST0iMi4wIgogICBHSU1QOlBsYXRmb3JtPSJMaW51eCIKICAgR0lNUDpUaW1lU3RhbXA9IjE3MTkzOTUwOTQyMTUyNDIiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zOCIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQ6MDY6MjZUMTE6NDQ6NTIrMDI6MDAiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDI0OjA2OjI2VDExOjQ0OjUyKzAyOjAwIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MGI2YmJjOWUtODEwNC00OTJjLWI0NmUtZjZjMTY3MDMwYTY2IgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKExpbnV4KSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNi0yNlQxMDo1ODoyNSswMjowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiMjdlMzgwMi00Yjg4LTRmYTctYTU3NS1mMjAyZGQ5NTczNGYiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoTGludXgpIgogICAgICBzdEV2dDp3aGVuPSIyMDI0LTA2LTI2VDExOjQ0OjU0KzAyOjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PqBVbaUAAAAJcEhZcwAAXEYAAFxGARSUQ0EAAAAHdElNRQfoBhoJLDZ/fbSsAAAX+UlEQVR42u2deZgUxfnHP33MLrscqxwG5RREwWg8YtQYxURjogjrFTXeJnhFVHp2VuQehggCMkyjJhJjjAaJxCtmVAT8iUYDikpUNhiiSEBBuQSWsDC70931+6N7oKe2Z2fBVRZ2vs/Tz25XV79d1fO+/b71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"
                    alt="SwissGeo Logo"
                /></Link>

                <Text fontSize={16} ml={40} color='red' alignContent='center' fontWeight='$semibold'>Pilot Project</Text>
            </Box>
            {loading ? (
                <Text>Loading concepts...</Text>
            ) : error ? (
                <Text color="red">{error}</Text>
            ) : (
                <Box w={'33%'}>
                    <Select
                        value={concepts.find(option => option.value === selectedTerm)}
                        onChange={(selectedOption) => {
                            setSelectedTerm(selectedOption ? selectedOption.value : '');
                            handleNavigation(selectedOption);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && selectedTerm) {
                                const selectedOption = concepts.find(option => option.value === selectedTerm);
                                handleNavigation(selectedOption || null);
                            }
                        }}
                        options={concepts}
                        placeholder="Search term"
                        isSearchable={true}
                        classNamePrefix="react-select"
                        menuPortalTarget={document.body}
                        components={{ DropdownIndicator }}
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                fontSize: '14px',
                                color: 'black',
                                width: '100%'
                            }),
                            singleValue: (provided) => ({
                                ...provided,
                                fontSize: '12px',
                                color: 'black',
                            }),
                            placeholder: (provided) => ({
                                ...provided,
                                fontSize: '12px',
                                color: 'black',
                                fontWeight: 'bold'
                            }),
                            option: (provided) => ({
                                ...provided,
                                fontSize: '14px',
                                color: 'black',
                            }),
                            menu: (provided) => ({
                                ...provided,
                            }),
                            dropdownIndicator: (provided) => ({
                                ...provided,
                                color: '#999',
                                '&:hover': {
                                    color: '#666',
                                },
                                cursor: 'pointer',
                            }),
                            input: (provided) => ({
                                ...provided,
                                color: 'black',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }),
                        }}
                    />
                </Box>

            )}
            <Box w='33%' alignItems='flex-end' /* display='none' */>
                {/* <Icon as={UserRound} width={30} height={30} strokeWidth={1} /> */}
            </Box>
        </Box>
    );
}

export default Navbar;