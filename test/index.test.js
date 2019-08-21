const expect = require('chai').expect
const test = require('supertest')

const app = require('../index')


describe('GET /apps', () => {
  it('returns an array', () => {
    return test(app)
      .get('/apps')
      .expect(200)
      .then(res => {
        expect('Content-Type', /array/)
      })
      
  });
  it('should return a json file', () => {
    return test(app)
      .get('/apps')
      .expect('Content-Type', /json/);
  });
  it('should return status 400 when sort is incorrect type', () => {
    return test(app)
      .get('/apps?sort=wrong')
      .expect(400);
  });
  it('should return status 400 when genre is incorrect type', () => {
    return test(app)
      .get('/apps?genres=not')
      .expect(400);
  });
  it('should sort by Rating', () => {
    return test(app)
      .get('/apps?sort=Rating')
      .then(res => {
        expect('Content-Type', /array/)
        let i = 0;
        let sorted = true;
        while (sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].Rating <= res.body[i + 1].Rating;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it('should filter by genre', () => {
    return test(app)
      .get('/apps?genres=Arcade')
      .then(res => {
        expect('Content-Type', /array/)
        let filter = true;
        for (let i = 0; i < res.body.length; i++) {
          if (!(res.body[i].Genres.includes('Arcade'))) {
            filter = false;
            i = res.body.length;
          }
        }
        expect(filter).to.be.true;
      });
  });

});