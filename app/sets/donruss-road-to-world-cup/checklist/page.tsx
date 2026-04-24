'use client';

import { useState, useMemo } from 'react';
import Nav from '../../../../components/Nav';
import Link from 'next/link';

const checklistData = {
  'Base Veterans': [
    { num: 1, name: 'Brennan Johnson', nation: 'Cymru' },
    { num: 2, name: 'Neco Williams', nation: 'Cymru' },
    { num: 3, name: 'Daniel James', nation: 'Cymru' },
    { num: 4, name: 'Harry Wilson', nation: 'Cymru' },
    { num: 5, name: 'Iliman Ndiaye', nation: 'Senegal' },
    { num: 6, name: 'Nicolas Jackson', nation: 'Senegal' },
    { num: 7, name: 'Sadio Mane', nation: 'Senegal' },
    { num: 8, name: 'David Raya', nation: 'Spain' },
    { num: 9, name: 'Dean Huijsen', nation: 'Spain' },
    { num: 10, name: 'Lamine Yamal', nation: 'Spain' },
    { num: 11, name: 'Pedri', nation: 'Spain' },
    { num: 12, name: 'Nico Williams', nation: 'Spain' },
    { num: 13, name: 'Dani Olmo', nation: 'Spain' },
    { num: 14, name: 'Martin Zubimendi', nation: 'Spain' },
    { num: 15, name: 'Mikel Oyarzabal', nation: 'Spain' },
    { num: 16, name: 'Pau Cubarsi', nation: 'Spain' },
    { num: 17, name: 'Fabian Ruiz', nation: 'Spain' },
    { num: 18, name: 'Alvaro Morata', nation: 'Spain' },
    { num: 19, name: 'Unai Simon', nation: 'Spain' },
    { num: 20, name: 'Yunus Musah', nation: 'United States' },
    { num: 21, name: 'Timothy Weah', nation: 'United States' },
    { num: 22, name: 'Tyler Adams', nation: 'United States' },
    { num: 23, name: 'Joe Scally', nation: 'United States' },
    { num: 24, name: 'Weston McKennie', nation: 'United States' },
    { num: 25, name: 'Christian Pulisic', nation: 'United States' },
    { num: 26, name: 'Diego Luna', nation: 'United States' },
    { num: 27, name: 'Malik Tillman', nation: 'United States' },
    { num: 28, name: 'Matt Freese', nation: 'United States' },
    { num: 29, name: 'Antonio Rudiger', nation: 'Germany' },
    { num: 30, name: 'Maximilian Beier', nation: 'Germany' },
    { num: 31, name: 'Karim Adeyemi', nation: 'Germany' },
    { num: 32, name: 'Oliver Baumann', nation: 'Germany' },
    { num: 33, name: 'Deniz Undav', nation: 'Germany' },
    { num: 34, name: 'Maximilian Mittelstadt', nation: 'Germany' },
    { num: 35, name: 'Niclas Fullkrug', nation: 'Germany' },
    { num: 36, name: 'Kai Havertz', nation: 'Germany' },
    { num: 37, name: 'Leroy Sane', nation: 'Germany' },
    { num: 38, name: 'Serge Gnabry', nation: 'Germany' },
    { num: 39, name: 'Joshua Kimmich', nation: 'Germany' },
    { num: 40, name: 'Jamal Musiala', nation: 'Germany' },
    { num: 41, name: 'Marc-Andre ter Stegen', nation: 'Germany' },
    { num: 42, name: 'Robert Andrich', nation: 'Germany' },
    { num: 43, name: 'Florian Wirtz', nation: 'Germany' },
    { num: 44, name: 'Jonathan Burkardt', nation: 'Germany' },
    { num: 45, name: 'Jamie Donley', nation: 'Northern Ireland' },
    { num: 46, name: 'Trai Hume', nation: 'Northern Ireland' },
    { num: 47, name: 'Callum Marshall', nation: 'Northern Ireland' },
    { num: 48, name: 'Maximiliano Araujo', nation: 'Uruguay' },
    { num: 49, name: 'Manuel Ugarte', nation: 'Uruguay' },
    { num: 50, name: 'Federico Valverde', nation: 'Uruguay' },
    { num: 51, name: 'Ronald Araujo', nation: 'Uruguay' },
    { num: 52, name: 'Darwin Nunez', nation: 'Uruguay' },
    { num: 53, name: 'Facundo Pellistri', nation: 'Uruguay' },
    { num: 54, name: 'Dusan Vlahovic', nation: 'Serbia' },
    { num: 55, name: 'Lazar Samardzic', nation: 'Serbia' },
    { num: 56, name: 'Nikola Milenkovic', nation: 'Serbia' },
    { num: 57, name: 'Josko Gvardiol', nation: 'Croatia' },
    { num: 58, name: 'Ivan Perisic', nation: 'Croatia' },
    { num: 59, name: 'Mateo Kovacic', nation: 'Croatia' },
    { num: 60, name: 'Josip Stanisic', nation: 'Croatia' },
    { num: 61, name: 'Luka Modric', nation: 'Croatia' },
    { num: 62, name: 'Harry Kane', nation: 'England' },
    { num: 63, name: 'Jude Bellingham', nation: 'England' },
    { num: 64, name: 'Jordan Pickford', nation: 'England' },
    { num: 65, name: 'Bukayo Saka', nation: 'England' },
    { num: 66, name: 'Declan Rice', nation: 'England' },
    { num: 67, name: 'Anthony Gordon', nation: 'England' },
    { num: 68, name: 'Eberechi Eze', nation: 'England' },
    { num: 69, name: 'Phil Foden', nation: 'England' },
    { num: 70, name: 'Cole Palmer', nation: 'England' },
    { num: 71, name: 'Trent Alexander-Arnold', nation: 'England' },
    { num: 72, name: 'Myles Lewis-Skelly', nation: 'England' },
    { num: 73, name: 'Jarrod Bowen', nation: 'England' },
    { num: 74, name: 'Raul Jimenez', nation: 'Mexico' },
    { num: 75, name: 'Santiago Gimenez', nation: 'Mexico' },
    { num: 76, name: 'Edson Alvarez', nation: 'Mexico' },
    { num: 77, name: 'Cesar Huerta', nation: 'Mexico' },
    { num: 78, name: 'Luis Romo', nation: 'Mexico' },
    { num: 79, name: 'Johan Vasquez', nation: 'Mexico' },
    { num: 80, name: 'Hugo Larsson', nation: 'Sweden' },
    { num: 81, name: 'Alexander Isak', nation: 'Sweden' },
    { num: 82, name: 'Viktor Gyokeres', nation: 'Sweden' },
    { num: 83, name: 'Dejan Kulusevski', nation: 'Sweden' },
    { num: 84, name: 'Rafael Leao', nation: 'Portugal' },
    { num: 85, name: 'Bernardo Silva', nation: 'Portugal' },
    { num: 86, name: 'Joao Neves', nation: 'Portugal' },
    { num: 87, name: 'Diogo Costa', nation: 'Portugal' },
    { num: 88, name: 'Francisco Conceicao', nation: 'Portugal' },
    { num: 89, name: 'Vitinha', nation: 'Portugal' },
    { num: 90, name: 'Bruno Fernandes', nation: 'Portugal' },
    { num: 91, name: 'Cristiano Ronaldo', nation: 'Portugal' },
    { num: 92, name: 'Nuno Mendes', nation: 'Portugal' },
    { num: 93, name: 'Ruben Dias', nation: 'Portugal' },
    { num: 94, name: 'Pedro Neto', nation: 'Portugal' },
    { num: 95, name: 'Goncalo Ramos', nation: 'Portugal' },
    { num: 96, name: 'Brahim Diaz', nation: 'Morocco' },
    { num: 97, name: 'Bilal El Khannouss', nation: 'Morocco' },
    { num: 98, name: 'Eliesse Ben Seghir', nation: 'Morocco' },
    { num: 99, name: 'Achraf Hakimi', nation: 'Morocco' },
    { num: 100, name: 'Youssef En-Nesyri', nation: 'Morocco' },
    { num: 101, name: 'Abde Ezzalzouli', nation: 'Morocco' },
    { num: 102, name: 'Heung-Min Son', nation: 'Korea Republic' },
    { num: 103, name: 'Hee-chan Hwang', nation: 'Korea Republic' },
    { num: 104, name: 'Kang-in Lee', nation: 'Korea Republic' },
    { num: 105, name: 'Min-Hyuk Yang', nation: 'Korea Republic' },
    { num: 106, name: 'Edrick Menjivar', nation: 'Honduras' },
    { num: 107, name: 'Joseph Rosales', nation: 'Honduras' },
    { num: 108, name: 'Romell Quioto', nation: 'Honduras' },
    { num: 109, name: 'Kervin Arriaga', nation: 'Honduras' },
    { num: 110, name: 'Sandro Tonali', nation: 'Italy' },
    { num: 111, name: 'Moise Kean', nation: 'Italy' },
    { num: 112, name: 'Gianluigi Donnarumma', nation: 'Italy' },
    { num: 113, name: 'Davide Frattesi', nation: 'Italy' },
    { num: 114, name: 'Nicolo Barella', nation: 'Italy' },
    { num: 115, name: 'Mateo Retegui', nation: 'Italy' },
    { num: 116, name: 'Riccardo Calafiori', nation: 'Italy' },
    { num: 117, name: 'Giovanni Di Lorenzo', nation: 'Italy' },
    { num: 118, name: 'Giacomo Raspadori', nation: 'Italy' },
    { num: 119, name: 'Alessandro Bastoni', nation: 'Italy' },
    { num: 120, name: 'Samuele Ricci', nation: 'Italy' },
    { num: 121, name: 'Destiny Udogie', nation: 'Italy' },
    { num: 122, name: 'Luis Suarez', nation: 'Colombia' },
    { num: 123, name: 'James Rodriguez', nation: 'Colombia' },
    { num: 124, name: 'Jhon Arias', nation: 'Colombia' },
    { num: 125, name: 'Luis Diaz', nation: 'Colombia' },
    { num: 126, name: 'Richard Rios', nation: 'Colombia' },
    { num: 127, name: 'Mohammed Kudus', nation: 'Ghana' },
    { num: 128, name: 'Jordan Ayew', nation: 'Ghana' },
    { num: 129, name: 'Ernest Nuamah', nation: 'Ghana' },
    { num: 130, name: 'Inaki Williams', nation: 'Ghana' },
    { num: 131, name: 'Antoine Semenyo', nation: 'Ghana' },
    { num: 132, name: 'Scott McTominay', nation: 'Scotland' },
    { num: 133, name: 'John McGinn', nation: 'Scotland' },
    { num: 134, name: 'Billy Gilmour', nation: 'Scotland' },
    { num: 135, name: 'Bradley Barcola', nation: 'France' },
    { num: 136, name: 'Manu Kone', nation: 'France' },
    { num: 137, name: 'Ousmane Dembele', nation: 'France' },
    { num: 138, name: 'Jules Kounde', nation: 'France' },
    { num: 139, name: 'Mike Maignan', nation: 'France' },
    { num: 140, name: 'Michael Olise', nation: 'France' },
    { num: 141, name: 'Eduardo Camavinga', nation: 'France' },
    { num: 142, name: 'William Saliba', nation: 'France' },
    { num: 143, name: 'Desire Doue', nation: 'France' },
    { num: 144, name: 'Matteo Guendouzi', nation: 'France' },
    { num: 145, name: 'Kylian Mbappe', nation: 'France' },
    { num: 146, name: 'Randal Kolo Muani', nation: 'France' },
    { num: 147, name: 'Theo Hernandez', nation: 'France' },
    { num: 148, name: 'Marcus Thuram', nation: 'France' },
    { num: 149, name: 'Warren Zaire-Emery', nation: 'France' },
    { num: 150, name: 'Aurelien Tchouameni', nation: 'France' },
    { num: 151, name: 'Ramon Sosa', nation: 'Paraguay' },
    { num: 152, name: 'Julio Enciso', nation: 'Paraguay' },
    { num: 153, name: 'Diego Gomez', nation: 'Paraguay' },
    { num: 154, name: 'Lionel Messi', nation: 'Argentina' },
    { num: 155, name: 'Thiago Almada', nation: 'Argentina' },
    { num: 156, name: 'Alexis Mac Allister', nation: 'Argentina' },
    { num: 157, name: 'Julian Alvarez', nation: 'Argentina' },
    { num: 158, name: 'Enzo Fernandez', nation: 'Argentina' },
    { num: 159, name: 'Nico Gonzalez', nation: 'Argentina' },
    { num: 160, name: 'Emiliano Martinez', nation: 'Argentina' },
    { num: 161, name: 'Rodrigo de Paul', nation: 'Argentina' },
    { num: 162, name: 'Cristian Romero', nation: 'Argentina' },
    { num: 163, name: 'Lautaro Martinez', nation: 'Argentina' },
    { num: 164, name: 'Nico Paz', nation: 'Argentina' },
    { num: 165, name: 'Giuliano', nation: 'Argentina' },
    { num: 166, name: 'Martin Odegaard', nation: 'Norway' },
    { num: 167, name: 'Andreas Schjelderup', nation: 'Norway' },
    { num: 168, name: 'Antonio Nusa', nation: 'Norway' },
    { num: 169, name: 'Alexander Sorloth', nation: 'Norway' },
    { num: 170, name: 'Erling Haaland', nation: 'Norway' },
    { num: 171, name: 'Sander Berge', nation: 'Norway' },
    { num: 172, name: 'Caoimhin Kelleher', nation: 'Republic of Ireland' },
    { num: 173, name: 'Nathan Collins', nation: 'Republic of Ireland' },
    { num: 174, name: 'Evan Ferguson', nation: 'Republic of Ireland' },
    { num: 175, name: 'Gregor Kobel', nation: 'Switzerland' },
    { num: 176, name: 'Manuel Akanji', nation: 'Switzerland' },
    { num: 177, name: 'Granit Xhaka', nation: 'Switzerland' },
    { num: 178, name: 'Breel Embolo', nation: 'Switzerland' },
    { num: 179, name: 'Vini Jr.', nation: 'Brazil' },
    { num: 180, name: 'Gabriel', nation: 'Brazil' },
    { num: 181, name: 'Bruno Guimaraes', nation: 'Brazil' },
    { num: 182, name: 'Matheus Cunha', nation: 'Brazil' },
    { num: 183, name: 'Rodrygo', nation: 'Brazil' },
    { num: 184, name: 'Gabriel Martinelli', nation: 'Brazil' },
    { num: 185, name: 'Alisson Becker', nation: 'Brazil' },
    { num: 186, name: 'Savinho', nation: 'Brazil' },
    { num: 187, name: 'Vanderson', nation: 'Brazil' },
    { num: 188, name: 'Endrick', nation: 'Brazil' },
    { num: 189, name: 'Calvin Bassey', nation: 'Nigeria' },
    { num: 190, name: 'Victor Osimhen', nation: 'Nigeria' },
    { num: 191, name: 'Ademola Lookman', nation: 'Nigeria' },
    { num: 192, name: 'Victor Boniface', nation: 'Nigeria' },
    { num: 193, name: 'Alex Iwobi', nation: 'Nigeria' },
    { num: 194, name: 'Samuel Chukwueze', nation: 'Nigeria' },
    { num: 195, name: 'Piotr Zielinski', nation: 'Poland' },
    { num: 196, name: 'Jakub Kiwior', nation: 'Poland' },
    { num: 197, name: 'Robert Lewandowski', nation: 'Poland' },
    { num: 198, name: 'Kacper Urbanski', nation: 'Poland' },
    { num: 199, name: 'Sebastian Szymanski', nation: 'Poland' },
    { num: 200, name: 'Nicola Zalewski', nation: 'Poland' },
  ],
  'Rated Rookies': [
    { num: 201, name: 'Damion Downs', nation: 'United States' },
    { num: 202, name: 'Alex Freeman', nation: 'United States' },
    { num: 203, name: 'Jaminton Campaz', nation: 'Colombia' },
    { num: 204, name: 'Franjo Ivanovic', nation: 'Croatia' },
    { num: 205, name: 'Petar Sucic', nation: 'Croatia' },
    { num: 206, name: 'Jordan James', nation: 'Cymru' },
    { num: 207, name: 'Lewis Koumas', nation: 'Cymru' },
    { num: 208, name: 'Nick Woltemade', nation: 'Germany' },
    { num: 209, name: 'Lawrence Agyekum', nation: 'Ghana' },
    { num: 210, name: 'Ebenezer Annan', nation: 'Ghana' },
    { num: 211, name: 'Denzell Garcia', nation: 'Mexico' },
    { num: 212, name: 'Erik Lira', nation: 'Mexico' },
    { num: 213, name: 'Pablo Monroy', nation: 'Mexico' },
    { num: 214, name: 'Gilberto Mora', nation: 'Mexico' },
    { num: 215, name: 'Luka Vuskovic', nation: 'Croatia' },
    { num: 216, name: 'Osame Sahraoui', nation: 'Morocco' },
    { num: 217, name: 'Oussama Targhalline', nation: 'Morocco' },
    { num: 218, name: 'Tolu Arokodare', nation: 'Nigeria' },
    { num: 219, name: 'Isaac Price', nation: 'Northern Ireland' },
    { num: 220, name: 'Justin Devenny', nation: 'Northern Ireland' },
    { num: 221, name: 'Pierce Charles', nation: 'Northern Ireland' },
    { num: 222, name: 'Shea Charles', nation: 'Northern Ireland' },
    { num: 223, name: 'Sindre Walle Egeli', nation: 'Norway' },
    { num: 224, name: 'Thelo Aasgaard', nation: 'Norway' },
    { num: 225, name: 'Damian Bobadilla', nation: 'Paraguay' },
    { num: 226, name: 'Matias Galarza Fonda', nation: 'Paraguay' },
    { num: 227, name: 'Antoni Kozubal', nation: 'Poland' },
    { num: 228, name: 'Przemyslaw Wisniewski', nation: 'Poland' },
    { num: 229, name: 'Andrew Moran', nation: 'Republic of Ireland' },
    { num: 230, name: 'Rocco Vata', nation: 'Republic of Ireland' },
    { num: 231, name: 'Troy Parrott', nation: 'Republic of Ireland' },
    { num: 232, name: 'James Wilson', nation: 'Scotland' },
    { num: 233, name: 'Max Johnston', nation: 'Scotland' },
    { num: 234, name: 'Tommy Conway', nation: 'Scotland' },
    { num: 235, name: 'Antoine Mendy', nation: 'Senegal' },
    { num: 236, name: 'El Hadji Malick Diouf', nation: 'Senegal' },
    { num: 237, name: 'Ilay Camara', nation: 'Senegal' },
    { num: 238, name: 'Andrija Maksimovic', nation: 'Serbia' },
    { num: 239, name: 'Mihailo Ivanovic', nation: 'Serbia' },
    { num: 240, name: 'Mihajlo Cvetkovic', nation: 'Serbia' },
    { num: 241, name: 'Ognjen Mimovic', nation: 'Serbia' },
    { num: 242, name: 'Besfort Zeneli', nation: 'Sweden' },
    { num: 243, name: 'Hugo Bolin', nation: 'Sweden' },
    { num: 244, name: 'Nils Zatterstrom', nation: 'Sweden' },
    { num: 245, name: 'Sebastian Nanasi', nation: 'Sweden' },
    { num: 246, name: 'Noahkai Banks', nation: 'United States' },
    { num: 247, name: 'Alvyn Sanches', nation: 'Switzerland' },
    { num: 248, name: 'Aurele Amenda', nation: 'Switzerland' },
    { num: 249, name: 'Leonidas Stergiou', nation: 'Switzerland' },
    { num: 250, name: 'Johan Manzambi', nation: 'Switzerland' },
  ],
  'Kaboom': [
    { num: 1, name: 'Lionel Messi', nation: 'Argentina' },
    { num: 2, name: 'Cristiano Ronaldo', nation: 'Portugal' },
    { num: 3, name: 'Heung-Min Son', nation: 'Korea Republic' },
    { num: 4, name: 'Jude Bellingham', nation: 'England' },
    { num: 5, name: 'Bukayo Saka', nation: 'England' },
    { num: 6, name: 'Vini Jr.', nation: 'Brazil' },
    { num: 7, name: 'Martin Odegaard', nation: 'Norway' },
    { num: 8, name: 'Luka Modric', nation: 'Croatia' },
    { num: 9, name: 'Moise Kean', nation: 'Italy' },
    { num: 10, name: 'Kai Havertz', nation: 'Germany' },
    { num: 11, name: 'Alexander Isak', nation: 'Sweden' },
    { num: 12, name: 'Lamine Yamal', nation: 'Spain' },
    { num: 13, name: 'Pedri', nation: 'Spain' },
    { num: 14, name: 'Michael Olise', nation: 'France' },
    { num: 15, name: 'Robert Lewandowski', nation: 'Poland' },
    { num: 16, name: 'Edinson Cavani', nation: 'Uruguay' },
    { num: 17, name: 'Angel Di Maria', nation: 'Argentina' },
    { num: 18, name: 'Thierry Henry', nation: 'France' },
    { num: 19, name: 'Mesut Ozil', nation: 'Germany' },
    { num: 20, name: 'Ronaldo', nation: 'Brazil' },
    { num: 21, name: 'Sergio Aguero', nation: 'Argentina' },
    { num: 23, name: 'Pele', nation: 'Brazil' },
    { num: 24, name: 'Diego Maradona', nation: 'Argentina' },
    { num: 25, name: 'Franz Beckenbauer', nation: 'Germany' },
  ],
  'Signature Series Autographs': [
    { num: 1, name: 'Lionel Messi', nation: 'Argentina' },
    { num: 4, name: 'Kylian Mbappe', nation: 'France' },
    { num: 7, name: 'William Saliba', nation: 'France' },
    { num: 8, name: 'Christian Pulisic', nation: 'United States' },
    { num: 11, name: 'Shea Charles', nation: 'Northern Ireland' },
    { num: 13, name: 'Emiliano Martinez', nation: 'Argentina' },
    { num: 14, name: 'Harry Kane', nation: 'England' },
    { num: 16, name: 'Robert Lewandowski', nation: 'Poland' },
    { num: 17, name: 'Raul Jimenez', nation: 'Mexico' },
    { num: 20, name: 'Marcus Rashford', nation: 'England' },
    { num: 25, name: 'Martin Odegaard', nation: 'Norway' },
    { num: 30, name: 'Billy Gilmour', nation: 'Scotland' },
    { num: 31, name: 'Martin Odegaard', nation: 'Norway' },
    { num: 35, name: 'Jamie Vardy', nation: 'England' },
    { num: 37, name: 'Roy Keane', nation: 'Republic of Ireland' },
    { num: 42, name: 'Kaka', nation: 'Brazil' },
    { num: 43, name: 'Jay-Jay Okocha', nation: 'Nigeria' },
    { num: 44, name: 'Freddie Ljungberg', nation: 'Sweden' },
    { num: 45, name: 'Edinson Cavani', nation: 'Uruguay' },
  ],
  'Beautiful Game Autographs': [
    { num: 1, name: 'Lamine Yamal', nation: 'Spain' },
    { num: 3, name: 'Erling Haaland', nation: 'Norway' },
    { num: 11, name: 'Heung-Min Son', nation: 'Korea Republic' },
    { num: 13, name: 'Aurelien Tchouameni', nation: 'France' },
    { num: 14, name: 'Warren Zaire-Emery', nation: 'France' },
    { num: 15, name: 'Bradley Barcola', nation: 'France' },
    { num: 18, name: 'Vitinha', nation: 'Portugal' },
    { num: 20, name: 'Pedri', nation: 'Spain' },
    { num: 25, name: 'John McGinn', nation: 'Scotland' },
    { num: 26, name: 'Inaki Williams', nation: 'Ghana' },
    { num: 32, name: 'Luis Suarez', nation: 'Uruguay' },
    { num: 38, name: 'Ronaldo', nation: 'Brazil' },
    { num: 40, name: 'Luis Figo', nation: 'Portugal' },
  ],
  'Kit Kings Memorabilia': [
    { num: 1, name: 'Ethan Ampadu', nation: 'Cymru' },
    { num: 2, name: 'Brennan Johnson', nation: 'Cymru' },
    { num: 10, name: 'Pedri', nation: 'Spain' },
    { num: 12, name: 'Lamine Yamal', nation: 'Spain' },
    { num: 17, name: 'Cristiano Ronaldo', nation: 'Portugal' },
    { num: 21, name: 'Erling Haaland', nation: 'Norway' },
    { num: 22, name: 'Achraf Hakimi', nation: 'Morocco' },
    { num: 33, name: 'Kai Havertz', nation: 'Germany' },
    { num: 37, name: 'Ousmane Dembele', nation: 'France' },
    { num: 44, name: 'Luis Diaz', nation: 'Colombia' },
    { num: 46, name: 'Endrick', nation: 'Brazil' },
    { num: 50, name: 'Lionel Messi', nation: 'Argentina' },
  ],
};

const allNations = Array.from(
  new Set(Object.values(checklistData).flatMap(cards => cards.map(c => c.nation)))
).sort();

const sectionColors: Record<string, string> = {
  'Base Veterans': '#3aaa35',
  'Rated Rookies': '#3aaa35',
  'Kaboom': '#f59e0b',
  'Signature Series Autographs': '#3aaa35',
  'Beautiful Game Autographs': '#3aaa35',
  'Kit Kings Memorabilia': '#3aaa35',
};

export default function DonrussChecklistPage() {
  const [search, setSearch] = useState('');
  const [nationFilter, setNationFilter] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(Object.keys(checklistData).map(k => [k, true]))
  );

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filtered = useMemo(() => {
    const result: Record<string, typeof checklistData[keyof typeof checklistData]> = {};
    for (const [section, cards] of Object.entries(checklistData)) {
      const matches = cards.filter(c => {
        const matchesSearch = search === '' || c.name.toLowerCase().includes(search.toLowerCase());
        const matchesNation = nationFilter === '' || c.nation === nationFilter;
        return matchesSearch && matchesNation;
      });
      if (matches.length > 0) result[section] = matches;
    }
    return result;
  }, [search, nationFilter]);

  const totalCards = Object.values(filtered).reduce((sum, cards) => sum + cards.length, 0);

  return (
    <main style={{ background: '#faf7f0', minHeight: '100vh', color: '#1a1a1a', fontFamily: 'var(--font-dm-sans)' }}>
      <Nav />
      <div style={{ padding: '2.5rem 1.25rem', maxWidth: '960px', margin: '0 auto' }}>

        <Link href="/sets/donruss-road-to-world-cup" style={{ color: '#888', fontSize: '13px', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>
          ← Back to Set Guide
        </Link>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', background: 'rgba(58,170,53,0.1)', border: '1px solid rgba(58,170,53,0.25)', color: '#3aaa35', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px', marginBottom: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase' as const }}>
            🌍 World Cup 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-1px' }}>
            Donruss Road to FIFA World Cup 2026
          </h1>
          <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>Panini · 2025-26 · Full Checklist</p>
        </div>

        {/* Filters */}
        {/* Section Filter */}
<div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
  <button onClick={() => setOpenSections(Object.fromEntries(Object.keys(checklistData).map(k => [k, true])))}
    style={{ background: '#1F6F3A', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
    All
  </button>
  {Object.keys(checklistData).map(section => (
    <button key={section} onClick={() => setOpenSections(Object.fromEntries(Object.keys(checklistData).map(k => [k, k === section])))}
      style={{ background: openSections[section] && Object.values(openSections).filter(Boolean).length === 1 ? '#1F6F3A' : '#fff', color: openSections[section] && Object.values(openSections).filter(Boolean).length === 1 ? '#fff' : '#888', border: '1px solid #e0d9cc', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
      {section}
    </button>
  ))}
</div>

{/* Filters */}
<div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' as const }}>
          <input
            type="text"
            placeholder="Search player..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px', background: '#fff', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
          />
          <select
            value={nationFilter}
            onChange={e => setNationFilter(e.target.value)}
            style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
            <option value="">All Nations</option>
            {allNations.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          {(search || nationFilter) && (
            <button
              onClick={() => { setSearch(''); setNationFilter(''); }}
              style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#888', cursor: 'pointer', fontFamily: 'inherit' }}>
              Clear
            </button>
          )}
        </div>

        <div style={{ fontSize: '13px', color: '#888', marginBottom: '1.5rem' }}>
          Showing {totalCards} card{totalCards !== 1 ? 's' : ''}
        </div>

        {/* Sections */}
        {Object.entries(filtered).map(([section, cards]) => (
          <div key={section} style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '12px', marginBottom: '12px', overflow: 'hidden' }}>
            <button
              onClick={() => toggleSection(section)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>{section}</span>
                <span style={{ background: `rgba(${sectionColors[section] === '#f59e0b' ? '245,158,11' : '58,170,53'},0.1)`, color: sectionColors[section] || '#3aaa35', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px' }}>
                  {cards.length} cards
                </span>
              </div>
              <span style={{ fontSize: '18px', color: '#888' }}>{openSections[section] ? '−' : '+'}</span>
            </button>

            {openSections[section] && (
              <div style={{ borderTop: '1px solid #f0ede6' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#faf7f0' }}>
                      <th style={{ textAlign: 'left', padding: '8px 20px', fontSize: '11px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase' as const, letterSpacing: '0.5px', width: '60px' }}>#</th>
                      <th style={{ textAlign: 'left', padding: '8px 20px', fontSize: '11px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Player</th>
                      <th style={{ textAlign: 'left', padding: '8px 20px', fontSize: '11px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Nation</th>
                      <th style={{ textAlign: 'right', padding: '8px 20px', fontSize: '11px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>eBay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cards.map((card, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #f0ede6' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#faf7f0'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                        <td style={{ padding: '12px 20px', color: '#aaa', fontWeight: 600 }}>{card.num}</td>
                        <td style={{ padding: '12px 20px', fontWeight: 600, color: '#1a1a1a' }}>{card.name}</td>
                        <td style={{ padding: '12px 20px', color: '#666' }}>{card.nation}</td>
                        <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                          <a
                            href={`https://www.ebay.co.uk/sch/i.html?_nkw=${encodeURIComponent(`${card.name} Donruss World Cup 2026`)}&_sacat=261328`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '12px', color: '#3aaa35', fontWeight: 600, textDecoration: 'none' }}>
                            eBay →
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

        {Object.keys(filtered).length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>
            No cards found matching your search.
          </div>
        )}

        <div style={{ marginTop: '2rem', background: '#f0ede6', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.6 }}>
            <strong style={{ color: '#555' }}>Disclaimer:</strong> Checklist data is sourced from public checklists and may be subject to change. Always verify with official Panini sources. BoxxHQ is not affiliated with Panini.
          </div>
        </div>

      </div>
    </main>
  );
}