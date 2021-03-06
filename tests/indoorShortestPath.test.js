/* eslint-disable no-undef */
/* eslint-disable max-len */
import React from 'react';
import renderer from 'react-test-renderer';
import BuildingWithFloors from '../components/buildings/buildingView/buildingWithFloors';
import dijkstraPathfinder from '../indoor_directions_modules/dijkstraPathfinder';
import floorWaypointFinder from '../indoor_directions_modules/floorWaypointFinder';
import distanceBetweenTwoNodes from '../indoor_directions_modules/distanceBetweenTwoNodes';

beforeEach(() => {
  mockGraphFloor1 = {
    101: {
      x: 1,
      y: 1,
      adjacencyList: [
        '102',
        '104'
      ]
    },
    102: {
      x: 2,
      y: 1.5,
      adjacencyList: [
        '101',
        '103'
      ]
    },
    103: {
      x: 3,
      y: 1,
      adjacencyList: [
        '102',
        '105'
      ]
    },
    104: {
      x: 1.5,
      y: 3,
      adjacencyList: [
        '101',
        '106'
      ]
    },
    105: {
      x: 2.5,
      y: 3,
      adjacencyList: [
        '103',
        '108',
        'escalator'
      ]
    },
    106: {
      x: 1,
      y: 5,
      adjacencyList: [
        '102',
        '107'
      ]
    },
    107: {
      x: 2,
      y: 4.5,
      adjacencyList: [
        '106',
        '108',
        'escalator'
      ]
    },
    108: {
      x: 3,
      y: 5,
      adjacencyList: [
        '105',
        '107'
      ]
    },
    escalator: {
      x: 2,
      y: 3,
      adjacencyList: [
        '105',
        '108'
      ]
    }
  };
  mockGraphFloor2 = {
    201: {
      x: 2,
      y: 1,
      adjacencyList: [
        '202',
        '203'
      ]
    },
    202: {
      x: 1,
      y: 3,
      adjacencyList: [
        '201',
        '204',
        'escalator'
      ]
    },
    203: {
      x: 3,
      y: 3,
      adjacencyList: [
        '201',
        '204',
      ]
    },
    204: {
      x: 2,
      y: 4,
      adjacencyList: [
        '202',
        '203',
      ]
    },
    escalator: {
      x: 2,
      y: 3,
      adjacencyList: [
        '202'
      ]
    }
  };
  mockGraphs = {
    1: mockGraphFloor1,
    2: mockGraphFloor2
  };
});

it('Should return the proper distance', () => {
  const distance = distanceBetweenTwoNodes.nodeDistance(mockGraphFloor1['101'], mockGraphFloor1['102']);
  expect(distance).toBe(1.118033988749895);
});

it('Should indicate new node is not in closed list', () => {
  const adjacencyNodePredecessor = { id: '101', predecessor: undefined, distance: 0 };
  const adjacencyNode = { id: '103', predecessor: adjacencyNodePredecessor, distance: 2.24 };
  const closedList = [
    { id: '102', predecessor: adjacencyNodePredecessor, distance: 1.12 },
    { id: '104', predecessor: adjacencyNodePredecessor, distance: 2.06 }
  ];
  const isAnalyzed = dijkstraPathfinder.isAnalyzed(closedList, adjacencyNode);
  expect(isAnalyzed).toBe(false);
});

it('Should indicate analyzed node is in closed list', () => {
  const adjacencyNodePredecessor = { id: '101', predecessor: undefined, distance: 0 };
  const adjacencyNode = { id: '102', predecessor: adjacencyNodePredecessor, distance: 1.12 };
  const closedList = [
    { id: '102', predecessor: adjacencyNodePredecessor, distance: 1.12 },
    { id: '104', predecessor: adjacencyNodePredecessor, distance: 2.06 }
  ];
  const isAnalyzed = dijkstraPathfinder.isAnalyzed(closedList, adjacencyNode);
  expect(isAnalyzed).toBe(true);
});

it('Should add new node while maintaining sorted distance', () => {
  const adjacencyNodePredecessor = { id: '101', predecessor: undefined, distance: 0 };
  const adjacencyNode = { id: '104', predecessor: adjacencyNodePredecessor, distance: 2.06 };
  const openList = [
    { id: '102', predecessor: adjacencyNodePredecessor, distance: 1.12 },
    { id: '103', predecessor: adjacencyNodePredecessor, distance: 2.24 }];
  const expectedOpenList = [
    { id: '102', predecessor: adjacencyNodePredecessor, distance: 1.12 },
    { id: '104', predecessor: adjacencyNodePredecessor, distance: 2.06 },
    { id: '103', predecessor: adjacencyNodePredecessor, distance: 2.24 }];
  const newOpenList = dijkstraPathfinder.handleNodeAnalysis(openList, adjacencyNode);
  expect(newOpenList).toStrictEqual(expectedOpenList);
});

it('Should do nothing if new distance is higher', () => {
  const adjacencyNodePredecessor = { id: '101', predecessor: undefined, distance: 0 };
  const newAdjacencyNodePredecessor = { id: '104', predecessor: undefined, distance: 0 };
  const adjacencyNode = { id: '103', predecessor: newAdjacencyNodePredecessor, distance: 100 };
  const openList = [
    { id: '102', predecessor: adjacencyNodePredecessor, distance: 1.12 },
    { id: '103', predecessor: adjacencyNodePredecessor, distance: 2.24 }];
  const newOpenList = dijkstraPathfinder.handleNodeAnalysis(openList, adjacencyNode);
  expect(newOpenList).toStrictEqual(openList);
});

it('Should replace existing node details & sort openList if new distance is lower', () => {
  const adjacencyNodePredecessor = { id: '101', predecessor: undefined, distance: 0 };
  const newAdjacencyNodePredecessor = { id: '104', predecessor: undefined, distance: 0 };
  const adjacencyNode = { id: '103', predecessor: newAdjacencyNodePredecessor, distance: 1.5 };
  const openList = [
    { id: '102', predecessor: adjacencyNodePredecessor, distance: 1.12 },
    { id: '104', predecessor: adjacencyNodePredecessor, distance: 2.06 },
    { id: '103', predecessor: adjacencyNodePredecessor, distance: 2.24 }];
  const expectedOpenList = [
    { id: '102', predecessor: adjacencyNodePredecessor, distance: 1.12 },
    { id: '103', predecessor: newAdjacencyNodePredecessor, distance: 1.5 },
    { id: '104', predecessor: adjacencyNodePredecessor, distance: 2.06 }];
  const newOpenList = dijkstraPathfinder.handleNodeAnalysis(openList, adjacencyNode);
  expect(newOpenList).toStrictEqual(expectedOpenList);
});

it('Should convert the finish node to a proper SVG polyline', () => {
  const startNode = { id: '101', predecessor: undefined, distance: 0 };
  const intermediateNode = { id: '102', predecessor: startNode, distance: 1.12 };
  const finishNode = { id: '103', predecessor: intermediateNode, distance: 2.24 };
  const svgPolylinePoints = dijkstraPathfinder.createShortestPath(finishNode, [{ start: '101', finish: '103' }], [mockGraphFloor1]);
  expect(svgPolylinePoints).toStrictEqual(['10.3173828125,5.3173828125 10.634765625,5.47607421875 10.9521484375,5.3173828125 ']);
});

it('Should give the slope of a line', () => {
  const startNode = { x: 1, y: 2, adjacency_list: [] };
  const endNode = { x: 2, y: 4, adjacency_list: [] };
  const slope = floorWaypointFinder.calculateSlope([startNode, endNode]);
  expect(slope).toBe(2);
});

it('Should give the slope as infinity if deltaX is 0', () => {
  const startNode = { x: 2, y: 2, adjacency_list: [] };
  const endNode = { x: 2, y: 4, adjacency_list: [] };
  const slope = floorWaypointFinder.calculateSlope([startNode, endNode]);
  expect(slope).toBe(Infinity);
});

it('Should give the intercept of a line', () => {
  const slope = 0.5;
  const node = { x: 3, y: 2, adjacency_list: [] };
  const intercept = floorWaypointFinder.calculateIntercept(slope, node);
  expect(intercept).toBe(0.5);
});

it('Should give the intersection of two points', () => {
  const expectedIntersect = { x: 2, y: 7 };
  const slope1 = 2;
  const slope2 = 3;
  const intercept1 = 3;
  const intercept2 = 1;
  const intersect = floorWaypointFinder.intersectionOfTwoPoints(slope1, slope2, intercept1, intercept2);
  expect(intersect).toStrictEqual(expectedIntersect);
});

it('Should give waypoint distance (case where intersect is between start and end)', () => {
  const waypointNode = { x: 2, y: 2, adjacency_list: [] };
  const startNode = { x: 2, y: 0, adjacency_list: [] };
  const endNode = { x: 0, y: 2, adjacency_list: [] };
  const distance = floorWaypointFinder.distanceToWaypointCalculator(waypointNode, startNode, endNode);
  expect(distance).toBe(1.4142135623730951);
});

it('Should give waypoint distance (case where intersect is outside of start and end)', () => {
  const waypointNode = { x: 0, y: 4, adjacency_list: [] };
  const startNode = { x: 2, y: 0, adjacency_list: [] };
  const endNode = { x: 0, y: 2, adjacency_list: [] };
  const distance = floorWaypointFinder.distanceToWaypointCalculator(waypointNode, startNode, endNode);
  expect(distance).toBe(2.8284271247461903);
});

it('Should give waypoint distance (case where start and end line is horizontal)', () => {
  const waypointNode = { x: 1, y: 2, adjacency_list: [] };
  const startNode = { x: 0, y: 0, adjacency_list: [] };
  const endNode = { x: 2, y: 0, adjacency_list: [] };
  const distance = floorWaypointFinder.distanceToWaypointCalculator(waypointNode, startNode, endNode);
  expect(distance).toBe(2);
});

it('Should give waypoint distance (case where start and end line is vertical)', () => {
  const waypointNode = { x: 0, y: 1, adjacency_list: [] };
  const startNode = { x: 2, y: 2, adjacency_list: [] };
  const endNode = { x: 2, y: 0, adjacency_list: [] };
  const distance = floorWaypointFinder.distanceToWaypointCalculator(waypointNode, startNode, endNode);
  expect(distance).toBe(2);
});

it('Should give directions for a single floor', () => {
  const building = { building: 'T', buildingName: 'Test Building' };
  const floors = [{ floor: 1, component: null }, { floor: 2, component: null }];
  const turnInteriorModeOff = jest.fn();
  const buildingWithFloorsComponent = renderer.create(
    <BuildingWithFloors
      building={building}
      buildingFloorPlans={floors}
      floor={floors[0]}
      adjacencyGraphs={mockGraphs}
      turnInteriorModeOff={turnInteriorModeOff}
    />
  ).getInstance();
  buildingWithFloorsComponent.dijkstraHandler('101', '107');
  expect(buildingWithFloorsComponent.state.directionPath).toStrictEqual({
    1: '10.3173828125,5.3173828125 10.47607421875,5.9521484375 10.3173828125,6.5869140625 10.634765625,6.42822265625 '
  });
});

it('Should give directions for multiple floors', () => {
  const building = { building: 'T', buildingName: 'Test Building' };
  const floors = [{ floor: 1, component: null }, { floor: 2, component: null }];
  const turnInteriorModeOff = jest.fn();
  const buildingWithFloorsComponent = renderer.create(
    <BuildingWithFloors
      building={building}
      buildingFloorPlans={floors}
      floor={floors[0]}
      adjacencyGraphs={mockGraphs}
      turnInteriorModeOff={turnInteriorModeOff}
    />
  ).getInstance();
  buildingWithFloorsComponent.dijkstraHandler('101', '203');
  expect(buildingWithFloorsComponent.state.directionPath).toStrictEqual({
    1: '10.3173828125,5.3173828125 10.634765625,5.47607421875 10.9521484375,5.3173828125 10.79345703125,5.9521484375 10.634765625,5.9521484375 ',
    2: '10.634765625,5.9521484375 10.3173828125,5.9521484375 10.634765625,6.26953125 10.9521484375,5.9521484375 '
  });
});
