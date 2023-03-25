//подключаем express
const express = require('express')
//подключаем встроенный в node.js модуль path(чтобы было удобно работать с путями)
const path = require('path')
// генерация id для элементов.Пакет
// uuid и функция v4
const { v4 } = require('uuid')
//создаю объект приложениия через вызов функции express()
const app = express()
const defaultValue = [{ id: v4(), name: 'Grigory', value: '+7903-111-11-11', marked: false }]
let CONTACTS = []
//учим req работать с json с помощью
// мидлваре кот. находится в
// express.json()
app.use(express.json())

//первое соединение между клиентом и
// сервером посредством запроса GET
//получение списка контактов
app.get('/api/contacts', (req, res) => {
  const array = !CONTACTS.length ? defaultValue : [...CONTACTS, ...defaultValue]
  res.status(200).json(array)
})

//POST
//создание контакта
app.post('/api/contacts', (req, res) => {
  const contact = { ...req.body, id: v4(), marked: false }
  CONTACTS.push(contact)
  res.status(201).json(contact)
})

//DELETE
//удаление контакта
app.delete('/api/contacts/:id', (req, res) => {
  CONTACTS = CONTACTS.filter((contact) => contact.id !== req.params.id)
  res.status(200).json({ message: 'Контакт был удалён', CONTACTS })
})

//PUT
//изменение контакта при выделении
// marked = true
app.put('/api/contacts/:id', (req, res) => {
  const idx = CONTACTS.findIndex((contact) => contact.id === req.params.id)
  CONTACTS[idx] = req.body
  res.json(CONTACTS[idx])
})

//____________//
//Все эти запросы должны находится внизу,чтобы запускались последними
//_____________//
// //делаем папку client статической.Так как index.html запускает файл frontend.js по относительному пути...
// а index.html мы запускает из файла backend, то index.html может просто не найти файл frontend.js
app.use(express.static(path.resolve(__dirname, 'client')))

//когда я буду выполнять метод get под любым '*' роутом, тогда выполняем следующую функцию
// функция принимает req,res и возвращает результат html файла...с помощью функции sendFile
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

//запускаю сервер с параметрами(порт и cb(показывем процесс ожидания ...))
app.listen(3000, () => console.log('Server has been started on port 3000...'))
console.log('Hello')
