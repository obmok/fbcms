import React from 'react'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import PeopleList from './people-list'
import Loader from '../common/loader'
import {Provider} from 'react-redux';
import store from '../../redux/store';


Enzyme.configure({ adapter: new Adapter() })

describe('PeopleList component', () => {
  it('should render a loader', () => {
    const container = shallow(<Provider store={store}><PeopleList loading /></Provider>, {
      disableLifecycleMethods: true
    })

    expect(container.contains(<Loader />))
  })

  it('should render a list of people', () => {
    const container = shallow(<Provider store={store}><PeopleList people={people} /></Provider>, {
      disableLifecycleMethods: true
    })
    expect(container.contains(<tr />));
  })

})


