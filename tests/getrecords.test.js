import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../index'
const expect = chai.expect

// const chai = require('chai')
// const chaiHttp = require('chai-http')


chai.use(chaiHttp)
chai.should()

describe('Fetch records API', () => {
    it('Should fetch filtered records from the getir database on /getrecords route', (done) => {
        chai
            .request(app)
            .post('/getrecords')
            .send({
                startDate: '2016-10-12',
                endDate: '2017-10-10',
                minCount: 1500,
                maxCound: 1800
            })
            .set({ 'Content-Type': 'application/json' })
            .then((res) => {
                expect(res).to.have.status(200)
                const body = res.body
                done()
            })
            .catch((err) => done(err))
    })
})