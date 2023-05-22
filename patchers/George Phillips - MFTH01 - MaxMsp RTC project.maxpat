{
	"patcher" : 	{
		"fileversion" : 1,
		"appversion" : 		{
			"major" : 8,
			"minor" : 3,
			"revision" : 1,
			"architecture" : "x64",
			"modernui" : 1
		}
,
		"classnamespace" : "box",
		"rect" : [ 34.0, 77.0, 1852.0, 939.0 ],
		"bglocked" : 0,
		"openinpresentation" : 0,
		"default_fontsize" : 12.0,
		"default_fontface" : 0,
		"default_fontname" : "Consolas",
		"gridonopen" : 1,
		"gridsize" : [ 15.0, 15.0 ],
		"gridsnaponopen" : 1,
		"objectsnaponopen" : 1,
		"statusbarvisible" : 2,
		"toolbarvisible" : 1,
		"lefttoolbarpinned" : 0,
		"toptoolbarpinned" : 0,
		"righttoolbarpinned" : 0,
		"bottomtoolbarpinned" : 0,
		"toolbars_unpinned_last_save" : 0,
		"tallnewobj" : 0,
		"boxanimatetime" : 200,
		"enablehscroll" : 1,
		"enablevscroll" : 1,
		"devicewidth" : 0.0,
		"description" : "",
		"digest" : "",
		"tags" : "",
		"style" : "",
		"subpatcher_template" : "",
		"assistshowspatchername" : 0,
		"boxes" : [ 			{
				"box" : 				{
					"id" : "obj-739",
					"linecount" : 2,
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 178.375, 532.0, 41.0, 37.0 ],
					"text" : "verb 11",
					"varname" : "global-effects-message-proxy"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-728",
					"maxclass" : "newobj",
					"numinlets" : 3,
					"numoutlets" : 2,
					"outlettype" : [ "signal", "signal" ],
					"patching_rect" : [ 46.0, 618.0, 101.0, 23.0 ],
					"text" : "global-effects",
					"varname" : "global-effects"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-709",
					"maxclass" : "ezdac~",
					"numinlets" : 2,
					"numoutlets" : 0,
					"patching_rect" : [ 46.0, 678.0, 45.0, 45.0 ],
					"varname" : "main-ezdac"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "JetBrains Mono",
					"fontsize" : 30.0,
					"id" : "obj-126",
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 1274.923526406288147, 92.0, 110.0, 46.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 34.0, 29.0, 99.0, 46.0 ],
					"text" : "PANIC",
					"textcolor" : [ 0.094117647058824, 0.094117647058824, 0.094117647058824, 1.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-113",
					"linecount" : 4,
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 1261.930678844451904, 16.980769230769283, 181.0, 63.0 ],
					"text" : "Sends a panic message, this will trigger all synths to turn all notes off",
					"textcolor" : [ 0.850980392156863, 0.850980392156863, 0.850980392156863, 1.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-111",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 1385.200000166893005, 157.692307692307622, 55.0, 23.0 ],
					"text" : "s panic"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-63",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "dictionary" ],
					"patching_rect" : [ 100.0, 351.682263255119324, 114.0, 23.0 ],
					"text" : "dict.deserialize"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-58",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 252.870333909988403, 271.775702714920044, 55.0, 23.0 ],
					"text" : "compile"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-56",
					"maxclass" : "newobj",
					"numinlets" : 3,
					"numoutlets" : 3,
					"outlettype" : [ "", "", "" ],
					"patching_rect" : [ 46.0, 276.635529518127441, 127.0, 23.0 ],
					"text" : "route node clients"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-48",
					"maxclass" : "button",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 217.728980183601379, 271.775702714920044, 24.0, 24.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-24",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 46.0, 236.446250319480896, 312.0, 23.0 ],
					"saved_object_attributes" : 					{
						"filename" : "../scripts/build/controller.js",
						"parameter_enable" : 0
					}
,
					"text" : "js ../scripts/build/controller.js @autowatch 1"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-13",
					"maxclass" : "dict.view",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 386.915903925895691, 75.775702714920044, 286.635512709617615, 220.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-11",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 120.0, 115.0, 151.75, 23.0 ],
					"text" : "script processStatus"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-9",
					"maxclass" : "toggle",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "int" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 120.0, 44.0, 24.0, 24.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-7",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"patching_rect" : [ 120.0, 81.0, 80.200000166893005, 23.0 ],
					"text" : "metro 2000"
				}

			}
, 			{
				"box" : 				{
					"bgmode" : 0,
					"border" : 0,
					"clickthrough" : 0,
					"enablehscroll" : 0,
					"enablevscroll" : 0,
					"id" : "obj-5",
					"lockeddragscroll" : 0,
					"lockedsize" : 0,
					"maxclass" : "bpatcher",
					"name" : "n4m.monitor.maxpat",
					"numinlets" : 1,
					"numoutlets" : 1,
					"offset" : [ 0.0, 0.0 ],
					"outlettype" : [ "bang" ],
					"patching_rect" : [ 679.915887117385864, 75.775702714920044, 400.0, 220.0 ],
					"viewvisibility" : 1
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-4",
					"linecount" : 2,
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 46.0, 81.0, 55.0, 37.0 ],
					"text" : "script start"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-1",
					"linecount" : 2,
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "" ],
					"patching_rect" : [ 46.0, 164.0, 261.870333909988403, 37.0 ],
					"saved_object_attributes" : 					{
						"autostart" : 1,
						"defer" : 0,
						"watch" : 1
					}
,
					"text" : "node.script ../node/build/index.js @autostart 1 @watch 1"
				}

			}
, 			{
				"box" : 				{
					"bgcolor" : [ 0.129411764705882, 0.129411764705882, 0.129411764705882, 1.0 ],
					"blinkcolor" : [ 0.592156862745098, 0.247058823529412, 0.247058823529412, 1.0 ],
					"id" : "obj-110",
					"maxclass" : "button",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 1385.200000166893005, 89.000000000000114, 52.0, 52.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 150.019321322441101, 27.0, 51.0, 51.0 ]
				}

			}
, 			{
				"box" : 				{
					"angle" : 270.0,
					"background" : 1,
					"bordercolor" : [ 0.137254901960784, 0.796078431372549, 0.050980392156863, 1.0 ],
					"grad1" : [ 0.545098039215686, 0.537254901960784, 0.537254901960784, 1.0 ],
					"grad2" : [ 0.443137254901961, 0.43921568627451, 0.423529411764706, 1.0 ],
					"id" : "obj-123",
					"ignoreclick" : 0,
					"maxclass" : "panel",
					"mode" : 1,
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 1261.930678844451904, 81.980769230769283, 181.088642477989197, 66.038461538461434 ],
					"presentation" : 1,
					"presentation_rect" : [ 23.0, 21.0, 183.0, 62.0 ],
					"proportion" : 0.5,
					"style" : "panel001"
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"destination" : [ "obj-24", 0 ],
					"source" : [ "obj-1", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-5", 0 ],
					"midpoints" : [ 298.370333909988403, 216.0, 356.0, 216.0, 356.0, 44.0, 689.415887117385864, 44.0 ],
					"source" : [ "obj-1", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-1", 0 ],
					"midpoints" : [ 129.5, 150.0, 55.5, 150.0 ],
					"source" : [ "obj-11", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-111", 0 ],
					"source" : [ "obj-110", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-56", 0 ],
					"source" : [ "obj-24", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-1", 0 ],
					"source" : [ "obj-4", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-24", 0 ],
					"midpoints" : [ 227.228980183601379, 336.0, 33.0, 336.0, 33.0, 216.981307625770569, 55.5, 216.981307625770569 ],
					"source" : [ "obj-48", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-1", 0 ],
					"midpoints" : [ 55.5, 318.70092761516571, 33.0, 318.70092761516571, 33.0, 150.588784575462341, 55.5, 150.588784575462341 ],
					"source" : [ "obj-56", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-63", 0 ],
					"source" : [ "obj-56", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-24", 0 ],
					"midpoints" : [ 262.370333909988403, 336.0, 33.0, 336.0, 33.0, 216.046728134155273, 55.5, 216.046728134155273 ],
					"source" : [ "obj-58", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-13", 0 ],
					"midpoints" : [ 109.5, 398.411215424537659, 368.666666507720947, 398.411215424537659, 368.666666507720947, 55.654205083847046, 396.415903925895691, 55.654205083847046 ],
					"source" : [ "obj-63", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-11", 0 ],
					"source" : [ "obj-7", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-709", 1 ],
					"midpoints" : [ 137.5, 657.0, 81.5, 657.0 ],
					"source" : [ "obj-728", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-709", 0 ],
					"source" : [ "obj-728", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-728", 2 ],
					"midpoints" : [ 187.875, 603.0, 137.5, 603.0 ],
					"source" : [ "obj-739", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-7", 0 ],
					"source" : [ "obj-9", 0 ]
				}

			}
 ],
		"parameters" : 		{
			"obj-728::obj-2" : [ "amxd~", "amxd~", 0 ],
			"obj-728::obj-27" : [ "live.gain~", "live.gain~", 0 ],
			"parameterbanks" : 			{

			}
,
			"parameter_overrides" : 			{
				"obj-728::obj-27" : 				{
					"parameter_longname" : "live.gain~",
					"parameter_shortname" : "live.gain~"
				}

			}
,
			"inherited_shortname" : 1
		}
,
		"dependency_cache" : [ 			{
				"name" : "ChamberVerb.amxd",
				"bootpath" : "C74:/packages/Max for Live/patchers/Max Audio Effect/Chamberverb",
				"type" : "amxd",
				"implicit" : 1
			}
, 			{
				"name" : "ChamberVerb.amxd.maxsnap",
				"bootpath" : "~/Documents/Max 8/Projects/George Phillips - MFTH01 - MaxMsp RTC project/data",
				"patcherrelativepath" : "../data",
				"type" : "mx@s",
				"implicit" : 1
			}
, 			{
				"name" : "controller.js",
				"bootpath" : "~/Documents/Max 8/Projects/George Phillips - MFTH01 - MaxMsp RTC project/scripts/build",
				"patcherrelativepath" : "../scripts/build",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "crossfade~.maxpat",
				"bootpath" : "~/Documents/Max 8/Packages/RTC-lib/patchers/MSP",
				"patcherrelativepath" : "../../../Packages/RTC-lib/patchers/MSP",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "fit_jweb_to_bounds.js",
				"bootpath" : "~/Documents/Max 8/Projects/George Phillips - MFTH01 - MaxMsp RTC project/code",
				"patcherrelativepath" : "../code",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "global-effects.maxpat",
				"bootpath" : "~/Documents/Max 8/Projects/George Phillips - MFTH01 - MaxMsp RTC project/patchers",
				"patcherrelativepath" : ".",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "index.js",
				"bootpath" : "~/Documents/Max 8/Projects/George Phillips - MFTH01 - MaxMsp RTC project/node/build",
				"patcherrelativepath" : "../node/build",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "n4m.monitor.maxpat",
				"bootpath" : "~/Documents/Max 8/Projects/George Phillips - MFTH01 - MaxMsp RTC project/patchers",
				"patcherrelativepath" : ".",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "resize_n4m_monitor_patcher.js",
				"bootpath" : "~/Documents/Max 8/Projects/George Phillips - MFTH01 - MaxMsp RTC project/code",
				"patcherrelativepath" : "../code",
				"type" : "TEXT",
				"implicit" : 1
			}
 ],
		"autosave" : 0,
		"boxgroups" : [ 			{
				"boxes" : [ "obj-123", "obj-110", "obj-126", "obj-111", "obj-113" ]
			}
 ],
		"styles" : [ 			{
				"name" : "panel001",
				"parentstyle" : "",
				"multi" : 0
			}
 ],
		"bgcolor" : [ 0.054901960784314, 0.054901960784314, 0.054901960784314, 1.0 ],
		"editing_bgcolor" : [ 0.054901960784314, 0.054901960784314, 0.054901960784314, 1.0 ],
		"bgfillcolor_type" : "gradient",
		"bgfillcolor_color1" : [ 0.054901960784314, 0.054901960784314, 0.054901960784314, 1.0 ],
		"bgfillcolor_color2" : [ 0.2, 0.2, 0.2, 1.0 ],
		"bgfillcolor_color" : [ 0.054901960784314, 0.054901960784314, 0.054901960784314, 1.0 ]
	}

}
