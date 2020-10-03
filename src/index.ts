import Idea from './Idea';
import IResource from './interface/IResource';

interface Resources {
  [name: string]: IResource;
}

const resources: Resources = {
  idea: new Idea(),
};

export default resources;
