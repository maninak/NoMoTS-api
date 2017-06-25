import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import chaiHttp = require('chai-http');
import mongoose = require('mongoose');
import { pending, slow, suite, test, timeout } from 'mocha-typescript';

import { API } from './../src/API';


// @suite @timeout(1000) @slow(100)
// class UserRouter {
//   api: Express.Application = API.bootstrap();

//    static before(): void {
//     chai.should();
//     chai.use(chaiHttp);
//     chai.use(chaiAsPromised);
//   }

//   @test('GET /users should respond with an array of all users')
//   GET_$users(): ChaiHttp.FinishedRequest {
//     return chai.request(this.api).get('/users')
//       .then((res: ChaiHttp.Response) => {
//         res.should.be.json;
//         res.should.have.status(200);
//         res.body.should.be.an('array');
//       });
//   }

//   @test ('GET /users/:id should respond with the specific requested user')
//   async GET_$users$id(): Promise<ChaiHttp.Response> {
//     // create a mock user
//     let createRes: ChaiHttp.Response = await chai.request(this.api).put('/users/create')
//       .set('email', 'mitsos@gmail.com')
//       .set('firstname', 'Mitsos')
//       .set('lastname', 'Gamatos');
//     // verify the mock user is returned with correct data when it is requested by id
//     return chai.request(this.api).get(`/users/${createRes.body._id}`)
//       .then((res: ChaiHttp.Response) => {
//         res.should.be.json;
//         res.should.have.status(200);
//         res.body.should.contain({ email: 'mitsos@gmail.com' });
//         res.body.should.contain({ firstname: 'Mitsos' });
//         res.body.should.contain({ lastname: 'Gamatos' });
//         res.body.should.contain.keys([ '_id', 'created_at' ]);
//       });
//   }

//   @test('PUT /users/create should create new user with the provided data')
//   PUT_$users$create(): ChaiHttp.FinishedRequest {
//     return chai.request(this.api).put('/users/create')
//       .set('email', 'mitsos@gmail.com')
//       .set('firstname', 'Mitsos')
//       .set('lastname', 'Gamatos')
//       .then((res: ChaiHttp.Response) => {
//         res.should.be.json;
//         res.should.have.status(200);
//         res.body.should.contain({ email: 'mitsos@gmail.com' });
//         res.body.should.contain({ firstname: 'Mitsos' });
//         res.body.should.contain({ lastname: 'Gamatos' });
//         res.body.should.contain.keys([ '_id', 'created_at' ]);
//       });
//   }

//   @test ('PUT /users/create should handle case of missing header fields')
//   PUT_$users$create_handlesMissingFields(): Chai.PromisedAssertion {
//     return chai.request(this.api).put('/users/create')
//       // all expected header fields intentionally missing from request
//       .should.be.rejectedWith('Not Acceptable');
//   }
// }
